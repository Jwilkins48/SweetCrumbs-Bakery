import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      {/* Hero section */}
      <div
        className="hero min-h-[70vh]"
        style={{
          backgroundImage: "url(/cupcake.jpg)",
        }}
      >
        <div
          className="hero-overlay"
          style={{ backgroundColor: "rgba(75,21,40,0.65)" }}
        ></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-4 text-5xl font-bold ">
              Freshly Baked Just for You
            </h1>
            <p className="mb-6 text-lg">
              Handcrafted baked goods made with love and ready for you to enjoy
            </p>
            <Link to="/catalog" className="btn btn-primary btn-lg rounded-md">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="py-12 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 ">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cakes */}
          <Link
            to="/catalog?category=Cakes"
            className="card bg-base-200 shadow hover:shadow-md transition"
          >
            <div className="card-body items-center text-center">
              <h3 className="card-title text-xl">Cakes</h3>
              <p className="text-sm text-base-content/70">
                Rich moist and made for every occasion
              </p>
            </div>
          </Link>

          {/* Cookies */}
          <Link
            to="/catalog?category=Cookies"
            className="card bg-base-200 shadow hover:shadow-md transition"
          >
            <div className="card-body items-center text-center">
              <h3 className="card-title text-xl">Cookies</h3>
              <p className="text-sm text-base-content/70 ">
                Freshly baked and perfectly sweet
              </p>
            </div>
          </Link>

          {/* Pies */}
          <Link
            to="/catalog?category=Pies"
            className="card bg-base-200 shadow hover:shadow-md transition"
          >
            <div className="card-body items-center text-center">
              <h3 className="card-title text-xl">Pies</h3>
              <p className="text-sm text-base-content/70">
                Classic homestyle pies with flaky crusts
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center bg-base-200 text-base-content p-6 mt-8">
        <p className="text-sm">
          © 2026 Sweet Crumbs Bakery. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default HomePage;
