import PagesMetaHead from "../components/PagesMetaHead"
import AppBanner from "../components/shared/AppBanner"

export default function Home() {
  return (
    <div className="container mx-auto flex items-center justify-center" style={{ minHeight: "calc(100vh - 200px)" }}>
      <PagesMetaHead title="Home" />
      <AppBanner />
    </div>
  )
}

