const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export function toBanglaNumber(num: number | string): string {
  return num
    .toString()
    .replace(/\d/g, (digit) => banglaDigits[parseInt(digit, 10)]);
}

export function formatTimeAgo(dateInput: string | Date): string {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);

  if (diffInMins < 1) {
    return "এখনই";
  }

  if (diffInMins < 60) {
    return `${toBanglaNumber(diffInMins)} মিনিট আগে`;
  }

  if (diffInHours < 24) {
    return `${toBanglaNumber(diffInHours)} ঘণ্টা আগে`;
  }

  const day = toBanglaNumber(date.getDate());
  const month = banglaMonths[date.getMonth()];
  const year = toBanglaNumber(date.getFullYear());

  return `${day} ${month} ${year}`;
}

export function formatBanglaDateTime(dateInput: string | Date): string {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return "";

  const day = toBanglaNumber(String(date.getDate()).padStart(2, "0"));
  const month = banglaMonths[date.getMonth()];
  const year = toBanglaNumber(date.getFullYear());

  let hours = date.getHours();
  const minutes = toBanglaNumber(String(date.getMinutes()).padStart(2, "0"));

  const period = hours >= 12 ? "পিএম" : "এএম";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const banglaHours = toBanglaNumber(String(hours).padStart(2, "0"));

  return `${day} ${month} ${year}, ${banglaHours}:${minutes} ${period}`;
}

const banglaDays = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const toBanglaDigits = (value: number | string) =>
  String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

export function getBanglaDate() {
  const date = new Date();

  return ` ${toBanglaDigits(
    date.getDate(),
  )} ${banglaMonths[date.getMonth()]} ${toBanglaDigits(date.getFullYear())}, ${banglaDays[date.getDay()]}`;
}
