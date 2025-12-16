import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Simple authentication for cron jobs
// In production, use proper API key authentication
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Execute the cleanup script
    const scriptPath = path.join(process.cwd(), 'scripts', 'cleanup-usage-events.sql');
    const { stdout, stderr } = await execAsync(`psql "${process.env.MEMORYHUB_DATABASE_URL}" -f "${scriptPath}"`);

    if (stderr && !stderr.includes('NOTICE')) {
      console.error('Cleanup script error:', stderr);
      return NextResponse.json({ 
        error: 'Cleanup failed', 
        details: stderr 
      }, { status: 500 });
    }

    console.log('Usage events cleanup completed:', stdout);

    return NextResponse.json({ 
      success: true, 
      message: 'Usage events cleanup completed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cleanup cron error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}