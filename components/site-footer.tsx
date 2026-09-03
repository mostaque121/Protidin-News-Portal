export function SiteFooter() {
  return (
    <footer className="bg-navy py-9.5 text-[#c7d1cf]">
      <div className="mx-auto flex w-[min(1180px,calc(100%-48px))] flex-wrap items-start justify-between gap-5.5">
        <div>
          <div className=" text-[34px] font-black tracking-[-.07em] text-white">
            প্রতিদিন<span className="text-primary">.</span>
          </div>
          <p className="my-1.25 text-xs">সত্যের পক্ষে, মানুষের পাশে</p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs">
          <span>আমাদের সম্পর্কে</span>
          <span>যোগাযোগ</span>
          <span>গোপনীয়তা নীতি</span>
        </div>
        <small className="w-full border-t border-white/[0.14] pt-4.25 text-[11px] text-[#92a5a6]">
          © ২০২৪ প্রতিদিন সংবাদ। সর্বস্বত্ব সংরক্ষিত।
        </small>
      </div>
    </footer>
  );
}
