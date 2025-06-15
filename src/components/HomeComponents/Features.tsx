import { Avatar, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    img: "https://i.ibb.co/1YN4ZBMX/f1.png",
    title: "Seamless Experience",
    desc: "Enjoy a smooth and intuitive shopping journey designed to save your time and effort across all devices.",
  },
  {
    img: "https://i.ibb.co/4wktbmc7/f2.png",
    title: "Fast Delivery",
    desc: "We ensure quick and reliable delivery so you receive your favorite products without any delays and worries.",
  },
  {
    img: "https://i.ibb.co/6R877gFv/f3.png",
    title: "24/7 Support",
    desc: "Our dedicated support team is always available to resolve your queries and ensure a hassle-free experience.",
  },
];

export const Features = () => {
  return (
    <div className="my-20 mx-4 md:mx-10">
      <div>
        <h2 className="text-center text-3xl font-bold mb-16">Our Features</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-around items-stretch gap-12">
        {features.map((feature) => (
          <div key={feature.title} className="text-center max-w-sm p-5 shadow-lg flex flex-col items-center mx-auto">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={feature.img} alt={feature.title} />
            </Avatar>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="font-light">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
