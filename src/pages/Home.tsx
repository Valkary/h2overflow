export default function Home() {
  return <section className="bg-slate-400 flex-grow w-full flex-col">
    <div className="w-full relative">
      <div className="font-medium text-4xl text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white">
        <h1>It's time we all do our part,</h1>
        <h1 className="inline">
          Do something
          <a className="inline decoration-none bg-[#0A369D] hover:bg-blue-400 rounded-[10px] px-[5px] transition-all duration-300 ml-2" href="/login">
            <span className="inline decoration-none rounded">NOW!</span>
          </a>
        </h1>
      </div>
      <video className="w-full h-full -z-[1] md:aspect-[3.65/1] brightness-50 object-cover object-center" autoPlay muted loop src="/video.mp4" />
    </div>

    <div className="container">
      <div className="flex flex-col md:flex-row w-full h-fit justify-around items-center text-center gap-5 mt-5">
        <div className="w-full flex-grow">
          <h1 className="text-xl"><strong>Welcome to H<sub>2</sub>O<sub>verflow</sub></strong></h1>
          <p className="text-lg">
            We are passionate about conserving one of our planet's most precious resources - water. Our mission is to
            empower you to take control of your water usage and <strong className="underline">reduce your water
              footprint</strong>. We understand that every drop counts, and that's why we've developed an innovative
            tracking system to help you monitor and manage your water consumption like never before.
          </p>
        </div>
        <div className="w-full flex justify-center items-center flex-grow">
          <img className="w-1/3 md:w-1/2 object-center object-cover" src="/water-save.svg" />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row w-full h-fit justify-around items-center text-center gap-5 mt-5 mb-10">
        <div className="w-full flex justify-center items-center flex-grow">
          <img className="w-1/3 md:w-1/2 object-center object-cover" src="/water-drops.svg" />
        </div>
        <div className="w-full flex-grow">
          <h1 className="text-xl"><strong>The Importance of Saving Water</strong></h1>
          <p className="text-lg">Water is a fundamental resource, essential for our survival and the health of our planet.
            Saving water is about being responsible stewards of our environment and ensuring a sustainable
            future. It's a simple yet crucial action that contributes to the well-being of our ecosystems,
            conserves energy, and supports our daily needs. By using water wisely, we not only secure our
            own future but also the future of generations to come. </p>
        </div>
      </div>
    </div>
  </section>
}