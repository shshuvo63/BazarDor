
import Image from "next/image";
import HeroBanner from "./components/Hero";
import PriceIncreasedProducts from "./components/PriceIncreasedProducts";
import PriceDecreasedProducts from "./components/PriceDecreasedProducts";
import AllProducts from "./components/AllProducts";



export default function Home() {
  return (
   <div>
    <HeroBanner></HeroBanner>
    <PriceIncreasedProducts></PriceIncreasedProducts>
    <PriceDecreasedProducts></PriceDecreasedProducts>
    <AllProducts></AllProducts>
    
    

   </div>
  );
}
