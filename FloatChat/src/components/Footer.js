export const Footer = () => {
    return (
        <footer className="p-4 bg-white shadow md:flex md:items-center md:justify-between md:p-6 w-full mt-auto">
            <span className="text-sm text-gray-500 sm:text-center flex items-center">© 2025 <span className="ml-1 font-semibold hover:underline">FloatChat</span>. All Rights Reserved.</span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
                <li>
                    <a href="#" target="_blank" className="mr-4 hover:underline md:mr-6 ">Facebook</a>
                </li>
                <li>
                    <a href="#" target="_blank" className="mr-4 hover:underline md:mr-6">LinkedIn</a>
                </li>
                <li>
                    <a href="#" target="_blank" className="mr-4 hover:underline md:mr-6">Youtube</a>
                </li>
                <li>
                    <a href="#" target="_blank" className="hover:underline">Contact</a>
                </li>
            </ul>
        </footer>
    )
}

