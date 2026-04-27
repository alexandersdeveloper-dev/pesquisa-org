import Hero from '../components/Hero/Hero'
import InfoCards from '../components/InfoCards'
import HowItWorks from '../components/HowItWorks'
import Trust from '../components/Trust'
import FAQ from '../components/FAQ'
import SatisfactionModal from '../components/SatisfactionModal'

export default function Home({ token, blocked, onStart, showSurvey, onClose, onComplete }) {
  return (
    <>
      <Hero token={token} onStart={onStart} blocked={blocked} />
      <InfoCards />
      <HowItWorks />
      <Trust />
      <FAQ />
      {showSurvey && (
        <SatisfactionModal token={token} onClose={onClose} onComplete={onComplete} />
      )}
    </>
  )
}
