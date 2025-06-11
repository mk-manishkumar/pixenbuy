import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const Features = () => {
  return (
    <div className="my-20 mx-4 md:mx-10">
      <div>
        <h2 className="text-center text-3xl font-bold mb-16">Our Features</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-around items-stretch gap-12">
        {/* Feature Card 1 */}
        <div className="text-center max-w-sm p-5 shadow-lg flex flex-col items-center mx-auto">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="https://i.ibb.co/1YN4ZBMX/f1.png" alt="Seamless Experience" />
          </Avatar>
          <h3 className="text-xl font-semibold mb-3">Seamless Experience</h3>
          <p className="font-light">Enjoy a smooth and intuitive shopping journey designed to save your time and effort across all devices.</p>
        </div>

        {/* Feature Card 2 */}
        <div className="text-center max-w-sm p-5 shadow-lg flex flex-col items-center mx-auto">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="https://i.ibb.co/4wktbmc7/f2.png" alt="Fast Delivery" />
          </Avatar>
          <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
          <p className="font-light">We ensure quick and reliable delivery so you receive your favorite products without any delays and worries.</p>
        </div>

        {/* Feature Card 3 */}
        <div className="text-center max-w-sm p-5 shadow-lg flex flex-col items-center mx-auto">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="https://i.ibb.co/6R877gFv/f3.png" alt="24/7 Support" />
          </Avatar>
          <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
          <p className="font-light">Our dedicated support team is always available to resolve your queries and ensure a hassle-free experience.</p>
        </div>
      </div>
    </div>
  );
};

