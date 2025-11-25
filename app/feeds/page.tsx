import SocialFeeds from '@/components/feeds/SocialFeeds'

export const metadata = {
  title: 'Social Feeds',
  description: 'View and interact with social posts'
}

export default function FeedsPage () {
  return (
    <div>
      <SocialFeeds />
    </div>
  )
}
