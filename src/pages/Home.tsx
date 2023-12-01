export default function Home() {

    return <section className="bg-slate-400 flex-grow">
    <div className="w-full h-fit container grid p-0 bg-[#CFDEE7]">
      <div className="grid-rows-1">
        <div className="columns-1 w-full aspect-[3.65/1] p-0 bg-black opacity-90 text-[#f0f8ff] flex justify-center items-center overflow-hidden hover:bg-blue-400">
          <div className="absolute font-medium text-4xl text-center">
            <h1>It's time we all do our part,</h1>
            <h1 className="inline">
              Do something 
              <a className="inline decoration-none bg-[#0A369D] rounded-[10px] px-[5px]" href="/login">
                <span className="inline decoration-none rounded">NOW!</span>
              </a>
            </h1>
          </div>
          <video className="w-full -z-[1] brightness-50" autoPlay muted loop src="/video.mp4"/>
        </div>
      </div>

      <div className="columns-2 mx-[50px] py-[50px] h-fit flex justify-center items-center text-center">
        <div className="columns-1 w-1/2">
          <h1 className="text-xl"><strong>Welcome to H<sub>2</sub>O<sub>verflow</sub></strong></h1>
          <p className="text-lg">
            We are passionate about conserving one of our planet's most precious resources - water. Our mission is to
            empower you to take control of your water usage and <strong className="underline">reduce your water
              footprint</strong>. We understand that every drop counts, and that's why we've developed an innovative
            tracking system to help you monitor and manage your water consumption like never before.
          </p>
        </div>
        <div className="columns-1 w-1/2 flex items-center justify-center">
          <img className="w-[46%]" src="/water-save.svg"/>
        </div>
      </div>

      <div className="columns-2 mx-[50px] py-[50px] h-fit flex justify-center items-center text-center">
        <div className="columns-1 w-1/2 flex items-center justify-center">
          <img className="w-[46%]" src="/water-drops.svg"/>
        </div>
        <div className="columns-1 w-1/2">
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