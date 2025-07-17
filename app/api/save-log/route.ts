import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const taskLog = await prisma.taskLog.create({
      data: {
        participant_id: data.participant_id,
        task_id: data.task_id,
        treatment_group: data.treatment_group,
        task_topic: data.task_topic,
        task_type: data.task_type,
        task_start_time: new Date(data.task_start_time),
        task_end_time: new Date(data.task_end_time),
        click_sequence: {
          create: data.click_sequence.map((click: any) => ({
            click_order: click.click_order,
            page_title: click.page_title,
            page_id: click.page_id,
            is_ad: click.is_ad,
            position_in_serp: click.position_in_serp,
            click_time: new Date(click.click_time),
            dwell_time_sec: click.dwell_time_sec,
            from_overview: click.from_overview,
            from_ai_mode: click.from_ai_mode,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, taskLog });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}