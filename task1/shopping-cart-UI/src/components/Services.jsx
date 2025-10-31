import React from 'react'
import { FaCreditCard, FaMale, FaRedo, FaShoppingBag, FaTruck } from 'react-icons/fa'

const data = [
  {
    icon: <FaTruck className="text-4xl dark:text-white" />,
    title: "Free Shipping",
    desc: "Orders from all items",
  },
  {
    icon: <FaRedo className="text-4xl dark:text-white" />,
    title: "Return & Refund",
    desc: "Money back guarantee",
  },
  {
    icon: <FaMale className="text-4xl dark:text-white" />,
    title: "Member Discount",
    desc: "On order over ₹99",
  },
  {
    icon: <FaCreditCard className="text-4xl dark:text-white" />,
    title: "Card Payments",
    desc: "All cards are available",
  },
]

const Services = () => (
  <div className="px-4 container grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-8 mx-auto">
    {data.map((item) => (
      <ServiceCard
        key={item.title}
        icon={item.icon}
        title={item.title}
        desc={item.desc}
      />
    ))}
  </div>
)

const ServiceCard = ({icon, title, desc}) => (
  <div className="flex gap-2 dark:bg-slate-600 px-4 py-0.5 font-karla">
    {icon}
    <div>
      <h2 className="font-medium text-xl dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-white">{desc}</p>
    </div>
  </div>
);

export default Services