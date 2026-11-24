import { BRAND_INFO, RICE_PRODUCTS, RiceProduct } from './mockData';

/**
 * Cấu hình dùng chung cho toàn site. Mọi địa chỉ / số điện thoại lấy từ BRAND_INFO (mockData.ts)
 * để nội dung, CTA, Zalo và schema luôn đồng bộ — KHÔNG gõ cứng số điện thoại ở nơi khác.
 */
export const SITE_URL = 'https://tuthien.gaosoctrang.com';
export const SITE_NAME = 'Gạo Từ Thiện – Vựa Gạo Sóc Trăng';

export const PHONE_DISPLAY = BRAND_INFO.hotlineDisplay;
export const PHONE_TEL = BRAND_INFO.hotline.replace(/\s+/g, '');
export const PHONE_E164 = '+84' + PHONE_TEL.replace(/^0/, '');
export const ZALO_URL = `https://zalo.me/${BRAND_INFO.zalo}`;
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=100063985415931';
export const MESSENGER_URL = 'https://m.me/100063985415931';
/** Hiện chỉ có MỘT số: vừa là hotline chính, vừa là Zalo nhận báo giá. */
export const CONTACT_LABEL = `Hotline & Zalo báo giá: ${PHONE_DISPLAY}`;

/** Ngày cập nhật bảng giá hiển thị trên site. TODO: sửa mỗi lần đổi giá trong mockData.ts */
export const PRICE_UPDATED = '24/11/2026';

export const PAGES = [
  { path: '/', label: 'Trang chủ' },
  { path: '/bao-gia-gao-tu-thien/', label: 'Báo giá' },
  { path: '/gao-phat-qua-tu-thien/', label: 'Gạo phát quà' },
  { path: '/gao-cung-duong-chua/', label: 'Cúng dường chùa' },
  { path: '/chon-gao-cho-bep-an-tu-thien/', label: 'Bếp ăn từ thiện' },
  { path: '/quy-cach-dong-bao-va-giao-hang/', label: 'Đóng bao & giao hàng' },
] as const;

export const QUOTE_PATH = '/bao-gia-gao-tu-thien/';
export const QUOTE_FORM_URL = `${QUOTE_PATH}#form-bao-gia`;

/**
 * Thông tin giao hàng và chính sách miễn phí vận chuyển theo ngưỡng sản lượng.
 */
export const DELIVERY = {
  leadTime:
    'Giao trong ngày tại TP.HCM & Bình Dương (hỗ trợ gấp 2–4 giờ từ kho Lái Thiêu, Thủ Đức, Quận 7). Đơn từ 500kg – 2 tấn nên đặt trước 1–2 ngày để kho đóng bao mới chuẩn quy cách.',
  fee: 'Miễn phí 100% xe tải giao tận nơi và phụ xe bốc xếp vào tận kho/sảnh Chùa tại TP.HCM & Bình Dương cho đơn từ 300kg trở lên (đơn dưới 300kg hoặc đi tỉnh hỗ trợ trợ giá cước tốt nhất theo tuyến xe nhà máy).',
  urgent:
    'Đoàn thiện nguyện hoặc chuyến cứu trợ cần gạo gấp: gọi trực tiếp 0762 234 135 để kho kiểm tra hàng sẵn và điều xe ngay.',
};

/** Khu vực giao — suy ra từ các chi nhánh và nhà máy đang có. */
export const DELIVERY_AREAS = [
  ...BRAND_INFO.branches.map((b) => ({
    area: b.area,
    from: b.name,
    address: b.address,
    isMain: Boolean(b.isMain),
    roleNote: b.roleNote,
    googleMapsUrl: b.googleMapsUrl,
  })),
  {
    area: BRAND_INFO.factory.area,
    from: BRAND_INFO.factory.name,
    address: BRAND_INFO.factory.address,
    isMain: false,
    roleNote: BRAND_INFO.factory.roleNote,
    googleMapsUrl: undefined,
  },
];

export const ORDER_STEPS = [
  {
    title: 'Gửi yêu cầu',
    desc: `Điền form "Nhận báo giá", nhắn Zalo hoặc gọi ${PHONE_DISPLAY}: loại gạo, số lượng, quy cách bao, địa điểm và ngày cần hàng.`,
  },
  {
    title: 'Nhận báo giá',
    desc: 'Kho báo đơn giá theo bậc số lượng, phí giao (nếu có) và thời gian giao dự kiến.',
  },
  {
    title: 'Chốt đơn',
    desc: 'Xác nhận loại gạo, số bao, quy cách, người nhận hàng và thông tin xuất hóa đơn VAT nếu cần.',
  },
  {
    title: 'Đóng bao & giao hàng',
    desc: 'Kho đóng bao theo quy cách đã chốt, xe giao từ chi nhánh phù hợp nhất với địa điểm.',
  },
  {
    title: 'Nhận hàng & bàn giao',
    desc: 'Kiểm tra số bao, chất lượng gạo khi nhận; hỗ trợ chụp ảnh / quay video bàn giao khi Quý đoàn cần.',
  },
];

/**
 * Ảnh thực tế (kho, đóng bao, giao hàng) từ /public/hoat-dong/.
 */
export const REAL_PHOTOS: { src: string; alt: string; caption: string }[] = [
  {
    src: '/hoat-dong/kho-gao-xuat-hang.jpg',
    alt: 'Kho bãi Vựa Gạo Sóc Trăng xuất hàng gạo từ thiện số lượng lớn',
    caption: 'Kho dự trữ và xuất hàng quy mô lớn tại Vựa Gạo Sóc Trăng, sẵn sàng điều xe tải giao nhanh.',
  },
  {
    src: '/hoat-dong/dong-goi-tui-5kg-pallet.jpg',
    alt: 'Đóng gói túi gạo từ thiện 5kg xếp pallet gọn gàng sạch sẽ',
    caption: 'Túi gạo 5kg được may miệng công nghiệp chắc chắn, xếp pallet khô ráo trước giờ xuất kho.',
  },
  {
    src: '/hoat-dong/chong-bao-huong-lai-10kg.jpg',
    alt: 'Chồng bao gạo Hương Lài 10kg chuẩn bị giao đoàn thiện nguyện',
    caption: 'Gạo đóng bao 10kg sạch đẹp, cam kết đúng trọng lượng và chất lượng đồng đều từng bao.',
  },
  {
    src: '/hoat-dong/chuan-bi-bao-gao-5kg.jpg',
    alt: 'Chuẩn bị các bao gạo từ thiện 5kg tại điểm tập kết phát quà',
    caption: 'Các phần gạo 5kg được sắp xếp ngay ngắn tại điểm tập kết trước khi bà con đến nhận quà.',
  },
  {
    src: '/hoat-dong/chuyen-xe-trao-tang.jpg',
    alt: 'Chuyến xe giao gạo từ thiện trao tận tay các cô chú lớn tuổi',
    caption: 'Đội xe giao gạo tận nơi đến chùa, mái ấm và trao tận tay bà con có hoàn cảnh khó khăn.',
  },
  {
    src: '/hoat-dong/tet-se-chia-cai-be.jpg',
    alt: 'Chương trình Tết Sẻ Chia trao tặng gạo nghĩa tình cho hộ nghèo',
    caption: 'Đồng hành cùng Quý mạnh thường quân trong các chuyến trao quà Tết Sẻ Chia tại miền Tây.',
  },
];

export const getProduct = (id: string) => RICE_PRODUCTS.find((p) => p.id === id);
export const getProducts = (ids: string[]) =>
  ids.map(getProduct).filter((p): p is RiceProduct => Boolean(p));

/** Đơn giá áp dụng theo số kg (bậc giá trong mockData). */
export const priceFor = (product: RiceProduct, kg: number) => {
  const tier = [...product.tiers].sort((a, b) => b.minKg - a.minKg).find((t) => kg >= t.minKg);
  return tier ? tier.pricePerKg : product.pricePerKg;
};

export const vnd = (n: number) => n.toLocaleString('vi-VN') + ' đ';

export const MAIN_BRANCH_MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.5848209705314!2d106.70452261082477!3d10.91912418919353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d7004b311ab3%3A0xd923ae41f79e52d8!2zVuG7sWEgR-G6oW8gU8OzYyBUcsSDbmc!5e0!3m2!1svi!2s!4v1794356110100!5m2!1svi!2s';

export const GOOGLE_MAPS_PLACE_URL = 'https://maps.google.com/?cid=15646541128765690584';

export const mapsSearchUrl = (address: string) => {
  if (address.includes('Lái Thiêu') || address.includes('Bình Dương')) {
    return GOOGLE_MAPS_PLACE_URL;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

export const HOME_FAQS = [
  {
    q: 'Mua gạo từ thiện ở đâu uy tín, giá sỉ tận gốc tại TP.HCM và các tỉnh lân cận?',
    a: 'Quý đoàn có thể đặt hàng trực tiếp tại Vựa Gạo Sóc Trăng — hệ thống cung cấp gạo từ thiện từ nhà máy xay xát Đồng Tháp với trụ sở chính đón khách xem mẫu, thử cơm tại Lái Thiêu (Bình Dương, giáp ranh TP.HCM), 2 kho điều phối giao hỏa tốc tại TP. Thủ Đức và Quận 7 (TP.HCM), cùng kho Tây Ninh phục vụ các tỉnh miền Đông và miền Tây.',
  },
  {
    q: '500kg hoặc 1 tấn gạo từ thiện giá bao nhiêu tiền?',
    a: 'Ở mốc 500kg, giá từ 7.000.000 đ (Gạo Sẻ Chia IR504) đến 7.350.000 đ (Gạo Nghĩa Tình dẻo vừa); ở mốc 1 tấn (1.000kg), giá từ 13.500.000 đ (Gạo Sẻ Chia) đến 14.200.000 đ (Gạo Nghĩa Tình) và 23.000.000 đ (Gạo ST25 Thượng Hạng). Đơn giá đã bao gồm miễn phí đóng bao 5kg – 10kg.',
  },
  {
    q: 'Kho gạo có hỗ trợ đóng túi nhỏ 5kg, 10kg miễn phí không?',
    a: 'Hoàn toàn miễn phí 100%. Vựa Gạo Sóc Trăng có sẵn các loại bao bì 5kg, 10kg in sẵn chữ "Gạo Từ Thiện / Gạo Nghĩa Tình" trang trọng và sạch đẹp. Toàn bộ chi phí bao bì, nhân công chia bao và may miệng túi chắc chắn đều được kho tài trợ 0 đồng cho Quý đoàn.',
  },
  {
    q: 'Doanh nghiệp, công ty mua làm từ thiện có xuất hóa đơn đỏ (VAT) không?',
    a: 'Có đầy đủ. Chúng tôi cung cấp hóa đơn điện tử VAT hợp pháp (thuế suất 5% đối với gạo sơ chế), hợp đồng mua bán và giấy chứng nhận kiểm nghiệm An toàn Vệ sinh Thực phẩm để doanh nghiệp quyết toán chi phí công đoàn, quỹ phúc lợi minh bạch.',
  },
  {
    q: 'Chi phí vận chuyển và hỗ trợ bốc xếp đến Chùa, Mái ấm như thế nào?',
    a: 'Miễn phí 100% xe tải giao tận nơi và phụ xe bốc xếp vào tận kho/sảnh Chùa tại TP.HCM & Bình Dương cho đơn từ 300kg trở lên. Với đơn dưới 300kg hoặc đi tỉnh, hệ thống 4 chi nhánh tại TP.HCM, Bình Dương, Tây Ninh và nhà máy Đồng Tháp luôn hỗ trợ ghép chuyến trợ giá cước tốt nhất cho Quý đoàn.',
  },
  {
    q: 'Nên chọn loại gạo nào để vừa ngon vừa tiết kiệm ngân sách nhất?',
    a: 'Nếu phát quà hộ gia đình/người già: Nên chọn Gạo Nghĩa Tình, Gạo Thiện Lành hoặc Gạo Thành Ý (hạt dẻo vừa, thơm ngọt, để nguội vẫn mềm cơm, giá chỉ từ 14.200đ - 16.000đ/kg). Nếu tài trợ cho bếp ăn 0 đồng hoặc chùa nấu cơm số lượng lớn: Nên chọn Gạo Sẻ Chia (nở xốp nhiều, dôi cơm, chan canh không bị nhão, giá tiết kiệm chỉ từ 13.500đ/kg).',
  },
  {
    q: 'Mạnh Thường Quân ở xa hoặc ở nước ngoài, kho có hỗ trợ quay video, chụp ảnh bàn giao không?',
    a: 'Chúng tôi có quy trình hỗ trợ riêng cho nhà hảo tâm kiều bào và người bận rộn: Giao đúng giờ đến tận cơ sở bảo trợ/chùa, cân ký minh bạch, quay video và chụp ảnh lễ trao tặng cùng đại diện điểm nhận và gửi báo cáo chi tiết qua Zalo.',
  },
  {
    q: 'Làm thế nào để cam kết gạo mới, không pha trộn và đúng số ký?',
    a: 'Vựa Gạo Sóc Trăng cam kết bằng văn bản: Gạo mới xay xát trực tiếp từ nhà máy Đồng Tháp, 100% không đấu trộn gạo cũ, không hương liệu hóa chất và không chất bảo quản. Quý khách được quyền kiểm tra chất lượng và cân thử từng bao trước khi thanh toán. Nếu phát hiện sai sót, đổi trả 100% ngay lập tức.',
  },
];
