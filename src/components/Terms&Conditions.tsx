import { useFooter } from "../api/home";
import AnimatedSection from "./ui/AnimatedSection";


export default function Termsandconditions() {
    const { data:termsandconditions  } = useFooter(false);
  return (
    <>
      <AnimatedSection direction="up" delay={0.2}>
        <section className="xl:mb-[100px] lg:mb-[80px] md:mb-[60px] mb-[40px]">
          <div className="container">
            <div className="flex flex-col gap-4">
              <div dangerouslySetInnerHTML={{ __html: termsandconditions?.terms_conditions }} />
            </div>
          </div>
        </section>
      </AnimatedSection>
      
    </>
  )
}
