import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.getConversations();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, model } = await req.json();
    const newConv = {
      id: 'conv-' + Date.now(),
      title: title || 'New Session',
      model: model || 'sonnet-3.7',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.saveConversation(newConv);
    return NextResponse.json(newConv);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
