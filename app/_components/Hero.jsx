import React from 'react'
import Image from 'next/image'

function Hero() {
    return (
    <section className="bg-white flex items-center flex-col justify-center">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-24 flex items-center justify-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Manage your expenses
            <strong className="text-indigo-600"> Control </strong>
            your money!
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            Track your spending effortlessly and take charge of your finances with SmartSpend.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <a
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              href="/sign-in"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
      <Image
        src={'/dashboard.png'}
        alt='dashboard'
        width={1000}
        height={700}
        className='-mt-9 rounded-xl border-2'
      />
    </section>
  )
}

export default Hero