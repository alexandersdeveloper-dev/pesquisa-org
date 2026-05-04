import Hero from '../components/Hero/Hero'
import InfoCards from '../components/InfoCards'
import HowItWorks from '../components/HowItWorks'
import Trust from '../components/Trust'
import FAQ from '../components/FAQ'
import SatisfactionModal from '../components/SatisfactionModal'
import { usePublicSurvey } from '../hooks/usePublicSurvey'

export default function Home({ blocked, onStart, showSurvey, onClose, onComplete }) {
  const { profileFields, questions, areas, campaign, loading, error } = usePublicSurvey()

  return (
    <>
      <Hero onStart={onStart} blocked={blocked} />
      <InfoCards />
      <HowItWorks />
      <Trust />
      <FAQ />
      {showSurvey && !loading && !error && (
        <SatisfactionModal
          onClose={onClose}
          onComplete={onComplete}
          questions={questions}
          profileFields={profileFields}
          areas={areas}
          campaign={campaign}
        />
      )}
    </>
  )
}
