import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("POST API Message Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save message." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("GET API Message Error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve messages." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Message deleted successfully." });
  } catch (error: any) {
    console.error("DELETE API Message Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete message." }, { status: 500 });
  }
}
