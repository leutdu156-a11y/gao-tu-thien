import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { RICE_PRODUCTS } from '@/data/mockData';
import {
  PRICE_UPDATED,
  SITE_URL,
  getProducts,
  priceFor,
  vnd,
} from '@/data/site';
import {
  CTABox,
  DeliveryAreas,
  FAQSection,
  OrderSteps,
  PageHeader,
  PriceTable,
  Section,
} from '@/components/content';
import { FastQuoteForm } from '@/components/FastQuoteForm';
import { GoogleReviews } from '@/components/GoogleReviews';

const CANONICAL = `${SITE_URL}/bao-gia-gao-tu-thien/`;

export const metadata: Metadata = {
  title: 'Báo Giá Gạo Từ Thiện TP.HCM (500kg, 1 Tấn)',
  description:
    'Bảng giá gạo từ thiện TP.HCM hôm nay theo mốc 100kg, 500kg, 1 tấn (Sẻ Chia, Nghĩa Tình, ST25). Đóng bao 5kg–10kg miễn phí, giao tận nơi, VAT 5%.',
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: 'Báo Giá Gạo Từ Thiện TP.HCM (500kg, 1 Tấn) | Vựa Gạo Sóc Trăng',
    description:
      'Bảng giá gạo từ thiện TP.HCM hôm nay theo mốc 100kg, 500kg, 1 tấn (Sẻ Chia, Nghĩa Tình, ST25). Đóng bao 5kg–10kg miễn phí, giao tận nơi, VAT 5%.',
    url: CANONICAL,
    type: 'article',
    images: [
      {
        url: `${SITE_URL}/og-gao-tu-thien.jpg`,
        width: 1200,
        height: 630,
        alt: 'Bảng báo giá gạo từ thiện giá sỉ tận gốc – Vựa Gạo Sóc Trăng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Báo Giá Gạo Từ Thiện TP.HCM (500kg, 1 Tấn) | Vựa Gạo Sóc Trăng',
    description:
      'Bảng giá gạo từ thiện TP.HCM hôm nay theo mốc 100kg, 500kg, 1 tấn (Sẻ Chia, Nghĩa Tình, ST25). Đóng bao 5kg–10kg miễn phí, giao tận nơi, VAT 5%.',
    images: [`${SITE_URL}/og-gao-tu-thien.jpg`],
  },
};

const bulkEstimateProducts = getProducts([
  'gao-se-chia',
  'gao-nghia-tinh',
  'gao-thien-lanh',
  'gao-st25-thuong-hang',
]);
const BULK_WEIGHTS = [100, 300, 500, 1000] as const;

const faqs = [
  {
    q: '500kg gạo từ thiện bao nhiêu tiền?',
    a: 'Ở mốc 500kg (nửa tấn — tương đương 100 bao 5kg hoặc 50 bao 10kg), tổng chi phí khoảng 7.000.000 đ với Gạo Sẻ Chia (IR504 nở xốp, 14.000 đ/kg), 7.350.000 đ với Gạo Nghĩa Tình (dẻo vừa phát quà, 14.700 đ/kg), 7.850.000 đ với Gạo Thiện Lành (Thơm Lài 3A, 15.700 đ/kg) và 11.900.000 đ với Gạo ST25 Thượng Hạng (23.800 đ/kg). Đơn giá đã bao gồm miễn phí bao bì và công đóng túi 5kg, 10kg.',
  },
  {
    q: '1 tấn gạo bao nhiêu tiền? Giá 1 tấn gạo ST25 là bao nhiêu?',
    a: 'Ở mốc 1.000kg (1 tấn — tương đương 200 bao 5kg hoặc 100 bao 10kg), giá sỉ tại kho từ 13.500.000 đ/tấn đối với Gạo Sẻ Chia (13.500 đ/kg), 14.200.000 đ/tấn đối với Gạo Nghĩa Tình (14.200 đ/kg), 15.000.000 đ/tấn đối với Gạo Thiện Lành (15.000 đ/kg) và 23.000.000 đ/tấn đối với Gạo ST25 Thượng Hạng (23.000 đ/kg). Đơn từ 5 tấn trở lên cho chương trình cứu trợ được áp dụng giá xuất xưởng trực tiếp từ nhà máy Đồng Tháp.',
  },
  {
    q: '100kg gạo từ thiện bao nhiêu tiền và có hỗ trợ đóng túi 5kg không?',
    a: 'Với mốc 100kg (tương đương 20 túi 5kg hoặc 10 bao 10kg), chi phí khoảng 1.500.000 đ (Gạo Sẻ Chia) đến 1.580.000 đ (Gạo Nghĩa Tình) hoặc 2.520.000 đ (ST25 Thượng Hạng). Kho vẫn hỗ trợ đóng sẵn bao 5kg, 10kg miễn phí cho các nhóm thiện nguyện nhỏ hoặc mua thử mẫu tại kho TP.HCM & Bình Dương.',
  },
  {
    q: 'Bảng giá gạo từ thiện áp dụng cho đơn hàng số lượng bao nhiêu?',
    a: 'Chúng tôi áp dụng bảng giá sỉ theo từng nấc khối lượng: dưới 300kg (cho đơn nhỏ / thử mẫu), từ 300kg - 499kg, từ 500kg - 999kg và từ 1.000kg (1 tấn) trở lên. Với các chương trình cứu trợ quy mô lớn từ 5 tấn trở lên, kho áp dụng chính sách giá xuất xưởng trực tiếp từ nhà máy Đồng Tháp.',
  },
  {
    q: 'Báo giá đã bao gồm chi phí đóng bao 5kg, 10kg chưa?',
    a: 'Chi phí đóng bao nhỏ 5kg, 10kg (bao bì in sẵn chữ Gạo Từ Thiện hoặc bao dệt may miệng chắc chắn) được tài trợ hoàn toàn miễn phí cho Quý đoàn thiện nguyện.',
  },
  {
    q: 'Doanh nghiệp mua gạo từ thiện có được xuất hóa đơn VAT không?',
    a: 'Có đầy đủ. Chúng tôi xuất hóa đơn điện tử VAT (thuế suất 5% cho mặt hàng gạo sơ chế) kèm hợp đồng mua bán và giấy chứng nhận ATVSTP để doanh nghiệp quyết toán chi phí công đoàn minh bạch.',
  },
  {
    q: 'Thời gian nhận bảng báo giá chính thức mất bao lâu?',
    a: 'Sau khi Quý đoàn điền form bên dưới hoặc nhắn Zalo/gọi hotline, chuyên viên gạo sẽ gửi bảng báo giá có dấu mộc công ty và ảnh mẫu gạo thực tế trong vòng 5 - 15 phút.',
  },
];

export default function BaoGiaPage() {
  return (
    <>
      <PageHeader
        title="Báo Giá Gạo Từ Thiện Giá Sỉ Tận Gốc"
        path="/bao-gia-gao-tu-thien/"
        crumb="Báo giá gạo từ thiện"
        intro={
          <>
            <p>
              Bảng báo giá gạo từ thiện giá rẻ TP.HCM sỉ tận gốc cập nhật ngày {PRICE_UPDATED} của{' '}
              <strong>Vựa Gạo Sóc Trăng</strong>. Đơn giá và giá gạo cứu trợ được tối ưu riêng cho các chương trình
              phát quà hộ nghèo, cúng dường tự viện, bếp cơm tình thương và cứu trợ bão lũ.
            </p>
            <p>
              Hỗ trợ đóng bao 5kg, 10kg miễn phí, xe tải giao nhanh nội thành TP.HCM, Bình Dương, Tây Ninh, Miền Tây
              đến tận chùa, mái ấm, bếp ăn và xuất hóa đơn điện tử VAT 5% đầy đủ.
            </p>
          </>
        }
      />

      {/* Bảng giá gạo sỉ bậc thang */}
      <Section id="bang-gia" title="Bảng Giá Sỉ Các Loại Gạo Từ Thiện Hôm Nay">
        <p className="text-sm text-gray-600 mb-4">
          Bảng giá chi tiết theo từng nấc số lượng. Bấm vào từng loại gạo hoặc điền form bên dưới để nhận bảng dự toán chính xác theo địa điểm giao.
        </p>
        <PriceTable products={RICE_PRODUCTS} anchors />

        {/* Cẩm nang liên kết nội bộ */}
        <div className="mt-8 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-emerald-950 mb-3">Xem Hướng Dẫn Chọn Gạo Chuyên Biệt Theo Từng Mục Đích:</h4>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
            <Link href="/gao-phat-qua-tu-thien/" className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-emerald-900 hover:text-emerald-700 hover:border-emerald-300 transition-colors block">
              🎁 Gạo phát quà hộ nghèo (túi 5kg - 10kg) &rarr;
            </Link>
            <Link href="/gao-cung-duong-chua/" className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-emerald-900 hover:text-emerald-700 hover:border-emerald-300 transition-colors block">
              🪷 Gạo ST25 cúng dường chùa &rarr;
            </Link>
            <Link href="/chon-gao-cho-bep-an-tu-thien/" className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-emerald-900 hover:text-emerald-700 hover:border-emerald-300 transition-colors block">
              🍲 Gạo lợi cơm cho quán cơm 0 đồng &rarr;
            </Link>
            <Link href="/quy-cach-dong-bao-va-giao-hang/" className="bg-white p-3 rounded-xl border border-emerald-100 font-semibold text-emerald-900 hover:text-emerald-700 hover:border-emerald-300 transition-colors block">
              🚚 Quy cách đóng bao & giao xe tải &rarr;
            </Link>
          </div>
        </div>
      </Section>

      {/* Bảng quy đổi tổng tiền theo mốc 100kg, 300kg, 500kg, 1 tấn */}
      <Section id="du-toan-khoi-luong" title="100kg, 500kg, 1 Tấn Gạo Từ Thiện Bao Nhiêu Tiền?" muted>
        <p className="text-sm text-gray-600 mb-4">
          Bảng quy đổi tổng chi phí theo từng mốc khối lượng giúp đoàn thiện nguyện, công đoàn và chương trình cứu trợ
          nhẩm nhanh ngân sách trước khi chốt đơn:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
              <tr>
                <th className="p-3 text-left">Loại gạo</th>
                <th className="p-3 text-right">100kg (20 bao 5kg)</th>
                <th className="p-3 text-right">300kg (60 bao 5kg)</th>
                <th className="p-3 text-right">500kg / Nửa tấn (100 bao 5kg)</th>
                <th className="p-3 text-right">1.000kg / 1 Tấn (200 bao 5kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {bulkEstimateProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60">
                  <td className="p-3 font-bold text-gray-900">
                    <div>{p.name}</div>
                    <div className="text-xs font-normal text-gray-500">{p.category}</div>
                  </td>
                  {BULK_WEIGHTS.map((kg) => {
                    const unit = priceFor(p, kg);
                    return (
                      <td key={kg} className="p-3 text-right whitespace-nowrap">
                        <div className="font-bold text-emerald-800">{vnd(unit * kg)}</div>
                        <div className="text-xs text-gray-500">({vnd(unit)}/kg)</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">
          * Tổng tiền trên đã bao gồm công đóng bao 5kg, 10kg miễn phí và hỗ trợ xuất hóa đơn điện tử VAT 5%. Chương trình
          cứu trợ từ 5 tấn trở lên vui lòng liên hệ trực tiếp để áp dụng giá xuất xưởng nhà máy Đồng Tháp.
        </p>
      </Section>

      {/* Form nhận báo giá nhanh */}
      <div id="form-bao-gia" className="scroll-mt-24">
        <FastQuoteForm />
      </div>

      {/* Đánh giá thực tế từ Google Maps */}
      <GoogleReviews />

      {/* Quy trình đặt hàng */}
      <Section title="Quy Trình Nhận Báo Giá & Đặt Hàng Gạo Từ Thiện" muted>
        <OrderSteps />
      </Section>

      {/* Khu vực và thời gian giao hàng */}
      <Section title="Khu Vực Giao Hàng & Hệ Thống 4 Chi Nhánh Kho">
        <DeliveryAreas />
      </Section>

      {/* FAQ Báo giá */}
      <FAQSection faqs={faqs} title="Câu Hỏi Thường Gặp Về Báo Giá Gạo Từ Thiện" />

      {/* CTA Box */}
      <CTABox currentPath="/bao-gia-gao-tu-thien/" />
    </>
  );
}
