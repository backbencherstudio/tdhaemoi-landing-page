import Link from "next/link";
import Image from "next/image";

export default function Category() {
    const data = [
        {
            id: 1,
            mainCategory: 'shoefinder',
            title: 'SHOE FINDER',
            image: '/main-categorys/shoesFinder.jpg',
            link: '/categories',
        },
        {
            id: 2,
            mainCategory: 'skifinder',
            title: 'SKI FINDER',
            image: '/main-categorys/skiFinder.jpg',
            link: '',
        },
        {
            id: 3,
            mainCategory: 'einlagenfinder',
            title: 'EINLAGENFINDER',
            image: '/main-categorys/einlagenfinder.jpg',
            link: '/categories/einlagenfinder',
        }
    ]
    return (
        <div className="flex flex-col md:flex-row h-screen w-full relative gap-2">
            {data.map((item, index) => (
                <Link
                    href={item.link}
                    key={item.id}
                    className="flex-1 relative group overflow-hidden"
                >
                    <div
                        style={{ backgroundImage: `url(${item.image})` }}
                        className={`h-full w-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105
                            ${index === 1 ? "grayscale" : ""}`}
                    >
                        <div className="absolute inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4">
                            <h2 className="text-white text-3xl lg:text-4xl font-semibold  text-center">
                                {item.title}
                            </h2>
                        </div>
                    </div>
                </Link>
            ))}
            <button className="absolute bottom-5 right-5 lg:bottom-10 lg:right-10 bg-white/95 text-black p-2 rounded-full shadow-2xl flex items-center space-x-3 transition-transform hover:scale-105">
                <Image src="/qrscanner.png" alt="scan" width={48} height={48} className="w-10 h-10 lg:w-12 lg:h-12" />
                <span className="font-semibold text-xs lg:text-sm pr-4 leading-tight">
                    Ausschließlich
                    <br />
                    Scandurchführung
                </span>
            </button>
        </div>
    )
}
