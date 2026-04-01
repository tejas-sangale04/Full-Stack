export function LocationSection() {
  return (
    <section id="location" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl tracking-wide text-foreground sm:text-4xl lg:text-5xl">
            Visit Us
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-primary" />
          <p className="mt-6 text-base text-muted-foreground lg:text-lg">
            Find us at our convenient location
          </p>
        </div>

        {/* Map and Details */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Map */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14996.676956831272!2d73.82571420148878!3d20.001410502447506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1772645930050!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Address */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-wide text-foreground">
                Address
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                Vriandavan Restaurant<br />
                Nandur Village<br />
              Nashik, Maharashtra 422005<br />
                India
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-wide text-foreground">
                Phone
              </h3>
              <p className="text-base text-muted-foreground">
                <a href="tel:+911234567890" className="hover:text-primary transition-colors">
                  +91 9456872637
                </a>
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-wide text-foreground">
                Email
              </h3>
              <p className="text-base text-muted-foreground">
                <a href="mailto:info@vriandavan.com" className="hover:text-primary transition-colors">
                  info@vriandavan.com
                </a>
              </p>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-wide text-foreground">
                Opening Hours
              </h3>
              <div className="space-y-1 text-base text-muted-foreground">
                <p>Monday - Friday: 11:00 AM - 11:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 12:00 AM</p>
              </div>
            </div>

            {/* Get Directions Button */}
            <div className="pt-4">
              <a
                href="https://maps.app.goo.gl/pjzvSzrLFAqvaeoZ7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 

