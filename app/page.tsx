import { promises as fs } from "fs";
import path from "path";
import PortfolioClient from "@/components/PortfolioClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  const text = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(text);

  return <PortfolioClient data={data} />;
}
