import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.getProjects();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, customInstructions } = await req.json();
    const newProject = {
      id: 'proj-' + Date.now(),
      title: title || 'Untitled Project',
      description: description || '',
      customInstructions: customInstructions || '',
      documentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    db.saveProject(newProject);
    return NextResponse.json(newProject);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
