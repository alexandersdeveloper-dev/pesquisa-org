import Hero from '../components/Hero/Hero'
import InfoCards from '../components/InfoCards'
import HowItWorks from '../components/HowItWorks'
import Trust from '../components/Trust'
import FAQ from '../components/FAQ'
import SatisfactionModal from '../components/SatisfactionModal'

export default function Home({ blocked, onStart, showSurvey, onClose, onComplete }) {
  return (
    <>
      <Hero onStart={onStart} blocked={blocked} />
      <InfoCards />
      <HowItWorks />
      <Trust />
      <FAQ />
      {showSurvey && (
        <SatisfactionModal onClose={onClose} onComplete={onComplete} />
      )}
    </>
  )
}
