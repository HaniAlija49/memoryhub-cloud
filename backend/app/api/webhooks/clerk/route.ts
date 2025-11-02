import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'
import { generateApiKey, hashApiKey, invalidateApiKeyCache } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get the Svix headers for verification
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      )
    }

    // Get the webhook secret from environment
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Get the body
    const payload = await request.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(webhookSecret)

    let evt: any

    // Verify the webhook signature
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the webhook event
    const eventType = evt.type

    if (eventType === 'user.created') {
      const { id, email_addresses } = evt.data

      // Get primary email
      const primaryEmail = email_addresses.find(
        (email: any) => email.id === evt.data.primary_email_address_id
      )

      if (!primaryEmail) {
        console.error('No primary email found for user:', id)
        return NextResponse.json(
          { error: 'No primary email found' },
          { status: 400 }
        )
      }

      // Check if user already exists with this Clerk ID
      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId: id },
      })

      if (existingUser) {
        // User already exists, just return success
        return NextResponse.json({
          success: true,
          apiKey: existingUser.apiKey,
        })
      }

      // Generate API key for the new user
      const apiKey = generateApiKey()
      const apiKeyHash = await hashApiKey(apiKey)

      // Create user in our database
      const user = await prisma.user.create({
        data: {
          email: primaryEmail.email_address,
          clerkUserId: id,
          apiKey,
          apiKeyHash,
        },
      })

      console.log('Created user:', user.id, 'for Clerk user:', id)

      return NextResponse.json({
        success: true,
        userId: user.id,
        apiKey: apiKey,
      })
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses } = evt.data

      // Get primary email
      const primaryEmail = email_addresses.find(
        (email: any) => email.id === evt.data.primary_email_address_id
      )

      if (!primaryEmail) {
        return NextResponse.json({ success: true })
      }

      // Update user email if changed
      await prisma.user.updateMany({
        where: { clerkUserId: id },
        data: { email: primaryEmail.email_address },
      })

      console.log('Updated user for Clerk user:', id)

      return NextResponse.json({ success: true })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      console.log('User deleted in Clerk:', id, '- deleting from database')

      // Find the user to get their API key for cache invalidation
      const user = await prisma.user.findUnique({
        where: { clerkUserId: id },
      })

      if (user) {
        // Invalidate API key cache
        await invalidateApiKeyCache(user.apiKey)

        // Delete user and cascade delete memories (configured in Prisma schema)
        await prisma.user.delete({
          where: { clerkUserId: id },
        })

        console.log('Successfully deleted user:', user.id, 'and all associated data')
      } else {
        console.log('User not found in database for Clerk ID:', id)
      }

      return NextResponse.json({ success: true })
    }

    // Return success for unhandled events
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
