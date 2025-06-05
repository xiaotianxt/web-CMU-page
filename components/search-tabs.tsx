import Link from "next/link"

export function SearchTabs() {
  const tabs = [
    { name: "AI Mode", active: false, href: "https://www.google.com/search?q=Is+there+any+popular+recommendation+for+laptop+choice&sca_esv=01731d022ec92237&biw=1512&bih=781&sxsrf=AHTn8zrFgDC6wgcDHJi1ttTDr3TYJQLoeQ%3A1747147700545&ei=tFsjaI_8ILja5NoP6bzIwQg&ved=2ahUKEwiqjt2O26CNAxVYD1kFHQ_oAB8Q2J8OegQIEBAC&uact=5&sclient=gws-wiz-serp&udm=50&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWp5u5rQsC2YJafWTbyNSy6G3Vsi155b_IyTtSTnvQaXi_dyan_Dv63xTqbEuRTX69ncXeYe2HMlp4fg0LiQTbV5VZEFm4mNO041kkBET9nkvaJ7fv4s4QjFboJGl-TcEQwD_5-PFbm8McRXwp_AhWnKqv_usUI7guGcsmwJ-oVR4nAcBjloV0L_NEJIUCOYwruiqOfHQ&aep=1&ntc=1" },
    { name: "All", active: true, href: "#" },
    { name: "Videos", active: false, href: "#" },
    { name: "Images", active: false, href: "#" },
    { name: "News", active: false, href: "#" },
    { name: "Short videos", active: false, href: "#" },
    { name: "Shopping", active: false, href: "#" },
    { name: "More", active: false, href: "#" },
  ]

  return (
    <div className="flex items-center space-x-6 px-44 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={`py-2 px-4 text-sm border-b-2 whitespace-nowrap ${
            tab.active ? "text-blue-600 border-blue-600" : "text-gray-600 border-transparent hover:text-gray-800"
          }`}
        >
          {tab.name}
        </Link>
      ))}
      <div className="ml-auto">
        <Link href="#" className="text-sm text-gray-600 hover:text-gray-800">
          Tools
        </Link>
      </div>
    </div>
  )
}
