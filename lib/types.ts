export type Category =
  | 'জাতীয়'
  | 'রাজনীতি'
  | 'খেলাধুলা'
  | 'শিক্ষা'
  | 'আন্তর্জাতিক'
  | 'অর্থনীতি'
  | 'বিনোদন'

export type NewsItem = {
  id: number
  category: Category
  title: string
  summary: string
  time: string
  author: string
  image: string
  tag?: string
  content: string[]
}
