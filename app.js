const WHATSAPP = "573052942120";
const SUPABASE_URL = "https://bdpsezwfhvowtchejkwc.supabase.co";
const SUPABASE_KEY = "sb_publishable_AeQxATh185F1r4Oepx_b1A_wRR0ZI1m";

// Consulta original:
`${SUPABASE_URL}/rest/v1/productos?select=codigo,nombre,categoria,precio,descripcion,imagen,activo&order=codigo.asc`

// Conversión original de imagen:
image: (p.imagen || "").split("/").pop()
