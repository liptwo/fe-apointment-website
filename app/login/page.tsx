import React from "react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { Heart, Shield, Clock, Users } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left Panel - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold">MediCare</span>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-semibold leading-tight text-balance">
              Hành trình chăm sóc sức khỏe của bạn bắt đầu từ đây
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-md">
              Kết nối với các chuyên gia chăm sóc sức khỏe và quản lý lịch hẹn của bạn một cách dễ dàng.
            </p>
          </div>

          <div className="grid gap-4">
            <FeatureItem
              icon={<Clock className="h-5 w-5" />}
              title="Đặt lịch dễ dàng"
              description="Đặt lịch hẹn chỉ trong vài giây"
            />
            <FeatureItem
              icon={<Users className="h-5 w-5" />}
              title="Các bác sĩ chuyên gia"
              description="Tiếp cận các chuyên gia được xác minh"
            />
            <FeatureItem
              icon={<Shield className="h-5 w-5" />}
              title="An toàn & Bảo mật"
              description="Dữ liệu của bạn luôn được bảo vệ"
            />
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          &copy; 2026 MediCare. Bảo lưu tất cả các quyền.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold text-foreground">MediCare</span>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {"Chưa có tài khoản? "}
          <Link
            href="/register"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90 transition-colors"
          >
            Tạo một cái
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90 transition-colors"
          >
            Quay về Trang chủ
          </Link>
        </p>
      </div>
    </main>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-primary-foreground/70">{description}</p>
      </div>
    </div>
  )
}
