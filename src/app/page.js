import Link from 'next/link';

export default function Home() {
  return (
    <main className="mt-20">
      {/* Hero Section */}
      <div className="text-center py-20 px-5">
        <h1 className="text-5xl font-black mb-6">
          Welcome to <span className="text-primary">BlogHub</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Create your own personal blog, share your stories, and discover amazing content from our community of writers.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <button className="btn btn-primary btn-lg">Get Started</button>
          </Link>
          <Link href="/posts">
            <button className="btn btn-outline btn-lg">Discover Posts</button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-5 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BlogHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3">Easy Blog Creation</h3>
              <p className="text-gray-600">
                Create beautiful blog posts with our intuitive editor. Add images, format text, and publish with just a few clicks.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-3">Your Own URL</h3>
              <p className="text-gray-600">
                Get your own unique blog URL (like yoursite.com/yourname) to share with friends and family.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Privacy Control</h3>
              <p className="text-gray-600">
                Choose which posts are public or private. You have full control over your content visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your account and choose your unique username for your blog URL.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">Create Posts</h3>
              <p className="text-gray-600">
                Write your stories, add images, and choose whether to make them public or private.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Share & Connect</h3>
              <p className="text-gray-600">
                Share your blog URL with others and discover amazing content from our community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-5 bg-primary text-primary-content">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Blog?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of writers and share your stories with the world.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <button className="btn btn-secondary btn-lg">Create Your Blog</button>
            </Link>
            <Link href="/about">
              <button className="btn btn-outline btn-lg">Learn More</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="py-10 px-5 text-center text-gray-600">
        <p>Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link></p>
      </div>
    </main>
  );
}
