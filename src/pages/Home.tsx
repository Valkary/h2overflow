export default function Home() {

    return <section className="bg-slate-400 flex-grow">
    <div className="w-full h-fit container grid p-0">
      <div className="grid-rows-1">
        <div className="columns-1 w-full aspect-[3.65/1] p-0 bg-black opacity-60 text-[#f0f8ff] flex justify-center items-center overflow-hidden">
          <div className="absolute">
            <h1>It's time we all do our part,</h1>
            <h1 className="inline">
              Do something
              <a className="inline decoration-none bg-[#0A369D] rounded py-1" href="/login">
                <span className="inline decoration-none  rounded">NOW!</span>
              </a>
            </h1>
          </div>
          <video className="w-full -z-[1]" autoPlay muted loop src="/video.mp4"/>
        </div>
      </div>

      <div className="row content">
        <div className="col-12 col-md-6">
          <h1><strong>Welcome to H<sub>2</sub>O<sub>verflow</sub></strong></h1>
          <p>
            We are passionate about conserving one of our planet's most precious resources - water. Our mission is to
            empower you to take control of your water usage and <strong className="underline">reduce your water
              footprint</strong>. We understand that every drop counts, and that's why we've developed an innovative
            tracking system to help you monitor and manage your water consumption like never before.
          </p>
        </div>
        <div className="col-12 col-md-6">
          <img width="45%" src="/svgs/water-save.svg"/>
        </div>
      </div>
      <div className="row content">
        <div className="col-12 col-md-6">
          <img width="45%" src="/svgs/water-drops.svg"/>
        </div>
        <div className="col-12 col-md-6">
          <h1>The Importance of Saving Water</h1>
          <p>Water is a fundamental resource, essential for our survival and the health of our planet.
            Saving water is about being responsible stewards of our environment and ensuring a sustainable
            future. It's a simple yet crucial action that contributes to the well-being of our ecosystems,
            conserves energy, and supports our daily needs. By using water wisely, we not only secure our
            own future but also the future of generations to come. </p>
        </div>
      </div>
    </div>
    </section>
}