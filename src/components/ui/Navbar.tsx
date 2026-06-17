import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const links = [
    { href: '#sobre-mi', label: 'Sobre mí' },
    { href: '#metodo', label: 'Método NEURO' },
    { href: '#programas', label: 'Programas' },
    { href: '#recursos', label: 'Recursos' },
    { href: '#tips', label: 'Tips' },
    { href: '#agenda', label: 'Agenda' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-cream/90 backdrop-blur-md border-beige-dark py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-5 md:py-6'
        }`}
        itemScope itemType="http://schema.org/SiteNavigationElement"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a 
            href="#hero" 
            className="relative z-[70] flex items-center gap-3 no-underline hover:opacity-80 transition-opacity"
          >
            <img src="/images/logo.jpeg" alt="Logo Eliana Martínez" className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[1.5px] border-rose-pale shadow-sm" />
            <span className="font-heading text-2xl md:text-[1.7rem] font-medium text-brown-dark tracking-wide">Eliana Martínez</span>
          </a>

          {/* Desktop Links */}
          <ul className="hidden xl:flex items-center gap-8 m-0 p-0 list-none">
            {links.map((link) => (
              <li key={link.href}>
                <a 
                  href={link.href}
                  className="text-[0.75rem] font-normal tracking-[0.15em] uppercase text-brown-mid no-underline transition-all duration-300 hover:text-rose hover:-translate-y-0.5 inline-block whitespace-nowrap"
                  itemProp="url"
                >
                  <span itemProp="name">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA & Mobile Toggle */}
          <div className="flex items-center gap-5">
            <a 
              href="#agenda" 
              className="hidden lg:flex items-center gap-2 bg-rose-pale text-rose px-5 py-2.5 rounded-full text-[0.72rem] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-rose hover:text-white"
            >
              Escríbeme 🤍
            </a>
            
            <button 
              className="xl:hidden relative z-[70] w-10 h-10 flex flex-col items-center justify-center gap-[5px] focus:outline-none group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className={`block w-7 h-[2px] bg-brown-dark rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : 'group-hover:-translate-y-[1px]'}`}></span>
              <span className={`block w-7 h-[2px] bg-brown-dark rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-7 h-[2px] bg-brown-dark rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : 'group-hover:translate-y-[1px]'}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[50] bg-cream/98 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] xl:hidden flex flex-col justify-center items-center ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-[10%] pointer-events-none'
        }`}
      >
        <div className="absolute top-24 left-10 w-[200px] h-[200px] bg-rose-pale/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-[250px] h-[250px] bg-beige-dark/40 rounded-full blur-3xl -z-10"></div>

        <ul className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full max-w-sm px-6">
          {links.map((link, index) => (
            <li 
              key={link.href}
              className={`w-full text-center overflow-hidden transition-all duration-500 delay-${index * 100}`}
              style={{
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
                opacity: isMobileMenuOpen ? 1 : 0,
                transitionDelay: `${isMobileMenuOpen ? 150 + index * 70 : 0}ms`
              }}
            >
              <a 
                href={link.href}
                className="font-heading text-4xl md:text-5xl text-brown-dark hover:text-rose transition-colors duration-300 inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-rose after:transition-all after:duration-300 hover:after:w-1/2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          
          <li 
            className="mt-8 w-full transition-all duration-500"
            style={{
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: isMobileMenuOpen ? 1 : 0,
              transitionDelay: `${isMobileMenuOpen ? 150 + links.length * 70 : 0}ms`
            }}
          >
            <a 
              href="https://wa.me/573118909491?text=Hola+Eliana+🤍+Vengo+desde+el+menú+de+tu+web+y+quiero+más+información" 
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-3 bg-rose text-white px-8 py-4 rounded-full text-[0.8rem] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-brown shadow-[0_8px_20px_rgba(201,137,124,0.3)] hover:-translate-y-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contactar por WhatsApp
            </a>
          </li>
        </ul>

        {/* Mobile Footer Links */}
        <div 
          className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 text-[0.8rem] text-brown-mid tracking-widest uppercase transition-all duration-500"
          style={{
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
            opacity: isMobileMenuOpen ? 1 : 0,
            transitionDelay: `${isMobileMenuOpen ? 800 : 0}ms`
          }}
        >
          <a href="https://www.instagram.com/psicoelia.co?utm_source=website&utm_medium=organic" target="_blank" className="hover:text-rose transition-colors">Instagram</a>
          <a href="mailto:info.psicoelia@gmail.com" className="hover:text-rose transition-colors">Correo</a>
        </div>
      </div>
    </>
  );
}
