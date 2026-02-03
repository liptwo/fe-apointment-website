import { Doctor, Subject } from '../types'

export const HOST_SPECIALTIES: Subject[] = [
  // {
  //   id: '1',
  //   name: 'Bác sĩ Gia Đình',
  //   icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/ChuyenKhoa.png'
  // },
  {
    id: '2',
    name: 'Tiêu Hóa Gan Mật',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/umc/subjects/1655710722460-TIEU_HOA_GAN_MAT.png'
  },
  {
    id: '3',
    name: 'Nội Tổng Quát',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/noi_tong_quat.png'
  },
  {
    id: '4',
    name: 'Nội Tiết',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/noi_tiet.png'
  },
  {
    id: '5',
    name: 'Da liễu',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/da_lieu.png'
  },
  {
    id: '6',
    name: 'Nội Tim Mạch',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tim_mach.png'
  },
  {
    id: '7',
    name: 'Nội Thần Kinh',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/than_kinh.png'
  },
  {
    id: '8',
    name: 'Nội Cơ Xương Khớp',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/noi_co_xuong_khop.png'
  },
  {
    id: '9',
    name: 'Tai Mũi Họng',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tai_mui_hong.png'
  },
  {
    id: '10',
    name: 'Mắt',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/mat.png'
  },
  {
    id: '11',
    name: 'Nội Tiêu Hoá',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tieu_hoa.png'
  },
  {
    id: '12',
    name: 'Nội Truyền Nhiễm',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/umc/subjects/PG/1651821563777-VIEM_GAN.png'
  },
  {
    id: '13',
    name: 'Nội Hô Hấp',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/ho_hap.png'
  },
  {
    id: '14',
    name: 'Nội Tiết Niệu',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tiet_nieu.png'
  },
  {
    id: '15',
    name: 'Ngoại Cơ Xương Khớp',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/xuong_khop_chinh_hinh.png'
  },
  {
    id: '16',
    name: 'Sản - Phụ Khoa',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/san_phu_khoa.png'
  },
  {
    id: '17',
    name: 'Ngoại Tiêu Hoá',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tieu_hoa.png'
  },
  {
    id: '18',
    name: 'Ngoại Tiết Niệu',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tiet_nieu.png'
  },
  {
    id: '19',
    name: 'Tâm Lý',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tam_ly.png'
  },
  {
    id: '21',
    name: 'Tâm Thần Kinh',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tam_than_kinh.png'
  },
  {
    id: '22',
    name: 'Ngoại Hô Hấp',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/ho_hap.png'
  },
  {
    id: '23',
    name: 'Ngoại Thần Kinh',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/ngoai_than_kinh.png'
  },
  {
    id: '24',
    name: 'Lồng Ngực - Mạch Máu',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/long_nguc_mach_mau.png'
  },
  {
    id: '25',
    name: 'Dinh Dưỡng',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/dinh_duong.png'
  },
  {
    id: '26',
    name: 'Thẩm mỹ da',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/umc/subjects/1655709747685-THAM_MY_DA.png'
  },
  {
    id: '27',
    name: 'Ngoại Tổng Quát',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/tong_quat.png'
  },
  {
    id: '28',
    name: 'Dị Ứng - Miễn Dịch Lâm Sàng',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/di_ung_mien_dich_lam_sang.png'
  },
  {
    id: '29',
    name: 'Răng Hàm Mặt',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/rang_ham_mat.png'
  },
  {
    id: '30',
    name: 'Chấn Thương Chỉnh Hình',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/chan_thuong_chinh_hinh.png'
  },
  {
    id: '31',
    name: 'Vô Sinh - Hiếm Muộn',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/umc/subjects/KBTS/1651820887681-SAN_KHOA_CHAN_DOAN_TRUOC_SINH.png'
  },
  {
    id: '32',
    name: 'Ngoại Ung Bướu',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/ung_buou.png'
  },
  {
    id: '33',
    name: 'Ung Bướu',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/ung_buou.png'
  },
  {
    id: '34',
    name: 'Nam Khoa',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/subjects/nam_khoa.png'
  },
  {
    id: '35',
    name: 'Lão Khoa',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/umc/subjects/PW/1651820749478-LAO_KHOA.png'
  },
  {
    id: '36',
    name: 'Vật Lý Trị Liệu - Phục Hồi Chức Năng',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/umc/subjects/1655708507374-PHUC_HOI_CHUC_NANG.png'
  },
  {
    id: '37',
    name: 'Y Học Cổ Truyền',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/default/avatar/ChuyenKhoa.png'
  },
  {
    id: '38',
    name: 'Tim Mạch Can Thiệp',
    icon: 'https://cdn-pkh.longvan.net/medpro-production/umc/subjects/1655710764408-TIM_MACH.png'
  },
  {
    id: '39',
    name: 'Tạo hình thẩm mỹ',
    icon: 'https://cdn.medpro.vn/medpro-production/medpro/subjects/1745302606104-tao_hinh_tham_my.png'
  },
  {
    id: '40',
    name: 'Cơ Xương Khớp - Chiropractic',
    icon: 'https://cdn.medpro.vn/medpro-production/medpro/subjects/1759222134922-chiropractic.png'
  },
  {
    id: '41',
    name: 'Nha Khoa',
    icon: 'https://cdn.medpro.vn/medpro-production/medpro/subjects/1759980701881-NHI.png'
  },
  {
    id: '42',
    name: 'Nhi Khoa',
    icon: 'https://cdn.medpro.vn/medpro-production/medpro/subjects/1759980664918-20251009_102810.png'
  }
]

export const DEMO_DOCTORS: Doctor[] = [
  {
    id: '1',
    title: 'TTUT BS CK2',
    name: 'Dương Minh Trí',
    specialty: 'Cơ Xương Khớp',
    specialtyId: '8',
    description: 'Bệnh về cơ xương khớp',
    price: 200000,
    schedule: 'Thứ 2,3,4,5,6,7',
    clinicName:
      'Phòng khám Cơ xương khớp chuyên sâu TTUT BS CK2 Dương Minh Trí',
    clinicAddress: '180B Lê Văn Sỹ, Phường Phú Nhuận, TP. Hồ Chí Minh'
  },
  {
    id: '2',
    title: 'BS',
    name: 'Nguyễn Quốc Linh',
    specialty: 'Vật lý trị liệu',
    specialtyId: '36',
    description: 'Bệnh về vật lý trị liệu - Phục hồi chức năng',
    price: 0,
    schedule: 'Thứ 2,3,4,5,6,7,Chủ nhật',
    clinicName: 'Phòng khám Y Học Cổ Truyền Y Khoa Thái Dương',
    clinicAddress: '15A Trần Khánh Du, P. Ninh Kiều, TP. Cần Thơ'
  },
  {
    id: '3',
    title: 'BS',
    name: 'Diệp Võ Phúc Thịnh',
    specialty: 'Chuyên khoa Nội',
    specialtyId: '2',
    description: 'Các bệnh lý chuyên khoa Nội',
    price: 0,
    schedule: 'Thứ 2,3,4,5,6,7,Chủ nhật',
    clinicName: 'Phòng khám Y Học Cổ Truyền Y Khoa Thái Dương',
    clinicAddress: '15A B. Trần Khánh Du, Xuân Khánh, Ninh Kiều, Cần Thơ'
  },
  {
    id: '4',
    title: 'BS',
    name: 'Vo Thi My Na',
    specialty: 'Nhi khoa',
    specialtyId: '42',
    description: 'Dang cap nhat...',
    price: 0,
    schedule: 'Thu 2,3,4,5,6,7,Chu nhat,Hen kham',
    clinicName: 'Phong kham Nhi BS Vo Thi My Na',
    clinicAddress:
      '2/41 Duong DT 743B, Khu Pho Binh Duc, Phuong Binh Hoa, Thanh Pho Thuan An, Tinh Binh Duong'
  },
  {
    id: '5',
    title: 'BS CKII',
    name: 'Ngo Trung Nam',
    specialty: 'San Phu Khoa',
    specialtyId: '16',
    description:
      'Phau thuat noi soi phu khoa - Mo thai ngoai noi soi - Bieu u nang - U xo - Mua hop nhan dao - Tu lo trong trinh benh ly lac noi mac tu cung-Sieu am buom nuoc noi nha tu cung-Vien nhiem phu khoa-Thai ky nguy co cao - Thai kham tang truong',
    price: 200000,
    schedule: 'Thu 2,3,4,5,6,7,Chu nhat,Hen kham',
    clinicName: 'Bac si Chuyen Khoa - Tu van Online qua App Medicare',
    clinicAddress: ''
  },
  {
    id: '6',
    title: 'BS CKI',
    name: 'Do Dang Khoa',
    specialty: 'Tim Mach',
    specialtyId: '6',
    description:
      'BS Do Dang Khoa la Bac si chuyen nganh Noi tim mach - Tim mach can thiep.',
    price: 200000,
    schedule: 'Thu 2,3,4,5,6,7,Chu nhat,Hen kham',
    clinicName: 'Bac si Chuyen Khoa - Tu van Online qua App Medicare',
    clinicAddress: ''
  },
  {
    id: '7',
    title: 'ThS BS',
    name: 'Lê Hoàng Thiên',
    specialty: 'Nội tổng quát',
    specialtyId: '3',
    description: 'Nội tổng quát',
    price: 149000,
    schedule: 'Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám',
    clinicName: 'Bác sĩ Chuyên Khoa - Tư vấn Online qua App Medicare',
    clinicAddress: ''
  },
  {
    id: '8',
    title: 'BS CKI',
    name: 'Vu Thi Ha',
    specialty: 'Mat',
    specialtyId: '10',
    description:
      'Dieu tri, tu van cong ngu phau thuat cac benh ly tai mat nhu: Duc the thuy tinh, glaucoma, hong the quanm, mi, u mi, laser bao sau, laser quang dong, kham benh ly vang mac dai thao duong',
    price: 130000,
    schedule: 'Thu 2,3,4,5,6,7,Chu nhat,Hen kham',
    clinicName: 'Bac si Chuyen Khoa - Tu van Online qua App Medicare',
    clinicAddress: ''
  }
]
