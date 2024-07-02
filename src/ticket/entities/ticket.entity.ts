import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class LichChieu {
  @PrimaryGeneratedColumn()
  ma_lich_chieu: number;

  @Column()
  ma_rap: number;

  @Column()
  ma_phim: number;

  @Column()
  ngay_gio_chieu: Date;

  @Column()
  gia_ve: number;

  @ManyToOne(() => RapPhim, rapPhim => rapPhim.lichChieu)
  rapPhim: RapPhim;

  @ManyToOne(() => Phim, phim => phim.lichChieu)
  phim: Phim;
}

@Entity()
export class Ghe {
  @PrimaryGeneratedColumn()
  ma_ghe: number;

  @Column()
  ten_ghe: string;

  @Column()
  loai_ghe: string;

  @Column()
  ma_rap: number;

  @ManyToOne(() => RapPhim, rapPhim => rapPhim.ghe)
  rapPhim: RapPhim;

  @ManyToOne(() => NguoiDung, nguoiDung => nguoiDung.ghe)
  nguoiDung: NguoiDung;
}

@Entity()
export class NguoiDung {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tai_khoan: string;

  @Column()
  ho_ten: string;

  @Column()
  email: string;

  @Column()
  so_dt: string;

  @Column()
  mat_khau: string;

  @Column()
  loai_nguoi_dung: string;

  @OneToMany(() => Ghe, ghe => ghe.nguoiDung)
  ghe: Ghe[];
}

@Entity()
export class RapPhim {
  @PrimaryGeneratedColumn()
  ma_rap: number;

  @Column()
  ten_rap: string;

  @Column()
  ma_cum_rap: number;

  @ManyToOne(() => CumRap, cumRap => cumRap.rapPhim)
  cumRap: CumRap;

  @OneToMany(() => LichChieu, lichChieu => lichChieu.rapPhim)
  lichChieu: LichChieu[];

  @OneToMany(() => Ghe, ghe => ghe.rapPhim)
  ghe: Ghe[];
}

@Entity()
export class CumRap {
  @PrimaryGeneratedColumn()
  ma_cum_rap: number;

  @Column()
  ten_cum_rap: string;

  @Column()
  dia_chi: string;

  @Column()
  ma_he_thong_rap: number;

  @ManyToOne(() => HeThongRap, heThongRap => heThongRap.cumRap)
  heThongRap: HeThongRap;

  @OneToMany(() => RapPhim, rapPhim => rapPhim.cumRap)
  rapPhim: RapPhim[];
}

@Entity()
export class Phim {
  @PrimaryGeneratedColumn()
  ma_phim: number;

  @Column()
  ten_phim: string;

  @Column()
  trailer: string;

  @Column()
  hinh_anh: string;

  @Column()
  mo_ta: string;

  @Column()
  ngay_khoi_chieu: Date;

  @Column()
  danh_gia: number;

  @Column()
  hot: boolean;

  @Column()
  dang_chieu: boolean;

  @Column()
  sap_chieu: boolean;

  @OneToMany(() => LichChieu, lichChieu => lichChieu.phim)
  lichChieu: LichChieu[];
}

@Entity()
export class HeThongRap {
  @PrimaryGeneratedColumn()
  ma_he_thong_rap: number;

  @Column()
  ten_he_thong_rap: string;

  @OneToMany(() => CumRap, cumRap => cumRap.heThongRap)
  cumRap: CumRap[];
}