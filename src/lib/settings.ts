export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/kelompoktani(.*)": ["kelompoktani"],
  "/penyuluh(.*)": ["penyuluh"],
  "/list/parapenyuluh": ["admin", "penyuluh", "kelompoktani"],
  "/list/parakelompoktani": ["admin", "penyuluh"],
  "/list/parakiospertanian": ["admin", "penyuluh", "kelompoktani"],
  "/list/materi": ["admin", "penyuluh", "kelompoktani"],
  "/list/kegiatan": ["admin", "penyuluh", "kelompoktani"],
  "/list/dokumentasiacara": ["admin", "penyuluh"],
  "/list/pengumuman": ["admin", "penyuluh", "kelompoktani"],
};