import { TableOfContents } from '@/components/blog'
import type { TableOfContentsItem } from '@/types'

interface SidebarProps {
  items: TableOfContentsItem[]
  activeId: string
}

export const Sidebar = ({ items, activeId }: SidebarProps) => (
  <aside aria-label="Table of contents" className="w-60 flex-shrink-0">
    <div className="sticky top-24">
      <TableOfContents items={items} activeId={activeId} />
    </div>
  </aside>
)
