import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export const revalidate = 60;

export async function GET() {
  try {
    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!token || !databaseId) {
      return NextResponse.json({ reviews: [] });
    }

    const notion = new Client({ auth: token });

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Approuvé",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviews = response.results.map((page: any) => {
      const props = page.properties;

      const name =
        props["Prénom"]?.title?.[0]?.plain_text ||
        props["Prénom"]?.rich_text?.[0]?.plain_text ||
        "Client";

      const rating = props["Étoiles"]?.number ?? 5;

      const services: string[] = (props["Services"]?.multi_select ?? []).map(
        (s: { name: string }) => s.name,
      );

      const comment = props["Commentaire"]?.rich_text?.[0]?.plain_text || "";

      return { id: page.id, name, rating, services, comment };
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("Notion API error:", err);
    return NextResponse.json({ reviews: [] });
  }
}
