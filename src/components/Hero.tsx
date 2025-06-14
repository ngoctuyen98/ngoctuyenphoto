
const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-thin mb-6 tracking-wide">
          Capturing
          <span className="block font-light">Moments</span>
        </h1>
        <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed opacity-90">
          Professional photography that tells your story through stunning visuals
        </p>
        <div className="mt-12">
          <a 
            href="#portfolio" 
            className="inline-block px-8 py-3 bg-white text-gray-900 font-light tracking-wide hover:bg-gray-100 transition-colors duration-300"
          >
            View Portfolio
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
