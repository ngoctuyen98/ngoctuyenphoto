
const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      ></div>
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-extralight mb-8 tracking-[0.02em] leading-[0.9]">
          NGOC TUYEN
        </h1>
        <div className="w-24 h-px bg-white/60 mx-auto mb-8"></div>
        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed opacity-90 tracking-wide">
          Contemporary photography that captures the essence of modern life through artistic vision and timeless composition
        </p>
        <div className="mt-16">
          <a 
            href="#portfolio" 
            className="inline-block text-sm tracking-[0.2em] uppercase font-light border border-white/30 px-12 py-4 hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm"
          >
            Explore Work
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
