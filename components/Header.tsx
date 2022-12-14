import { NextPage } from "next"
import Link from "next/link"

const Header: NextPage = () => {
    return (
        <header className="flex justify-between p-5 max-w-7xl mx-auto">
            <div className="flex items-center space-x-5">
                <Link href="/">
                    <img className="w-44 object-contain cursor-pointer" src="https://miro.medium.com/max/8978/1*s986xIGqhfsN8U--09_AdA.png" />
                </Link>

                <div className="hidden md:flex items-center space-x-5">
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3 className="text-white bg-green-600 rounded-full px-4 py-1">Follow</h3>
                </div>
            </div>

            <div className="flex items-center space-x-5 text-green-600">
                <h3>Sign in</h3>
                <h3 className="border-green-600 border rounded-full px-4 py-1">Get Started</h3>
            </div>
        </header>
    )
}

export default Header