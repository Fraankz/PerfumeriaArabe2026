import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const brand = searchParams.get("brand") || "";
    const family = searchParams.get("family") || "";
    const gender = searchParams.get("gender") || "";

    let query = "SELECT * FROM perfumes WHERE 1=1";
    const values = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(brand) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (brand) {
      query += ` AND brand = $${paramCount}`;
      values.push(brand);
      paramCount++;
    }

    if (family) {
      query += ` AND fragrance_family = $${paramCount}`;
      values.push(family);
      paramCount++;
    }

    if (gender) {
      query += ` AND gender = $${paramCount}`;
      values.push(gender);
      paramCount++;
    }

    query += " ORDER BY name ASC";

    const perfumes = await sql(query, values);
    return Response.json(perfumes);
  } catch (error) {
    console.error("Error fetching perfumes:", error);
    return Response.json(
      { error: "Failed to fetch perfumes" },
      { status: 500 },
    );
  }
}
