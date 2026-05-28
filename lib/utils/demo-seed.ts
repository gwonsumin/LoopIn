export function seedDemoData() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('loopin-demo-seeded') === 'true') return

  // 저장한 자료 (loopin_saved)
  localStorage.setItem('loopin_saved', JSON.stringify([
    'r-001', 'r-002', 'r-003', 'r-005', 'r-006', 'r-017', 'r-018', 'r-009'
  ]))

  // 학습 진행률
  const now = new Date()
  const ago = (min: number) => new Date(now.getTime() - min * 60000).toISOString()

  localStorage.setItem('loopin-progress-r-001', JSON.stringify({ status: 'completed', percent: 100, updatedAt: ago(120) }))
  localStorage.setItem('loopin-progress-r-002', JSON.stringify({ status: 'completed', percent: 100, updatedAt: ago(90) }))
  localStorage.setItem('loopin-progress-r-003', JSON.stringify({ status: 'started', percent: 52, updatedAt: ago(30) }))
  localStorage.setItem('loopin-progress-r-017', JSON.stringify({ status: 'completed', percent: 100, updatedAt: ago(200) }))
  localStorage.setItem('loopin-progress-r-005', JSON.stringify({ status: 'started', percent: 35, updatedAt: ago(60) }))
  localStorage.setItem('loopin-progress-r-009', JSON.stringify({ status: 'started', percent: 20, updatedAt: ago(15) }))

  // 플로우 저장
  localStorage.setItem('loopin-saved-flow-flow-001', 'true')
  localStorage.setItem('loopin-saved-flow-flow-002', 'true')

  // 나만의 Flow
  localStorage.setItem('loopin-my-flows', JSON.stringify([
    {
      id: 'my-flow-demo-1',
      title: 'UX 포트폴리오 준비',
      resourceIds: ['r-001', 'r-003', 'r-004'],
      createdAt: ago(300),
    },
  ]))

  localStorage.setItem('loopin-demo-seeded', 'true')
}
