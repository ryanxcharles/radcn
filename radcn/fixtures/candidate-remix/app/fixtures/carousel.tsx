import type { RemixNode } from 'remix/ui'
import type { FixtureScenario } from '../../../scenarios/types.ts'
import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'radcn'

const slides = ['One', 'Two', 'Three', 'Four', 'Five']

function SlideCard({ label, compact = false }: { compact?: boolean; label: string }) {
  return (
    <Card class="radcn-carousel-slide-card" style={compact ? '--radcn-carousel-slide-height:10rem' : undefined}>
      <CardContent style="display:grid;min-height:inherit;place-items:center;padding:1rem;">
        <span>{label}</span>
      </CardContent>
    </Card>
  )
}

function CandidateCarousel({
  className,
  compact = false,
  defaultIndex = 0,
  id,
  orientation = 'horizontal',
}: {
  className?: string
  compact?: boolean
  defaultIndex?: number
  id?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <Carousel ariaLabel="Featured slides" class={className} defaultIndex={defaultIndex} id={id} orientation={orientation}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem ariaLabel={`Slide ${index + 1} of ${slides.length}`} index={index} selected={index === defaultIndex}>
            {SlideCard({ compact, label: String(index + 1) })}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

function CarouselExample({
  autoplay = false,
  children,
}: {
  autoplay?: boolean
  children?: RemixNode
}) {
  return (
    <div
      class="radcn-carousel-example-stack"
      data-fixture-carousel-autoplay={autoplay ? 'true' : undefined}
      data-fixture-carousel-example
      data-fixture-carousel-delay={autoplay ? '250' : undefined}
    >
      {children}
    </div>
  )
}

function CarouselStatus() {
  return <div class="radcn-carousel-status" data-fixture-carousel-status>Slide 1 of 5</div>
}

export function renderCarouselFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'api':
      return CarouselExample({
        children: (
          <>
            {CandidateCarousel({ className: 'radcn-carousel--api', id: 'candidate-carousel-api' })}
            {CarouselStatus()}
          </>
        ),
      })
    case 'demo':
      return CandidateCarousel({ className: 'radcn-carousel--demo' })
    case 'orientation':
      return CandidateCarousel({ className: 'radcn-carousel--orientation', compact: true, orientation: 'vertical' })
    case 'plugin':
      return CarouselExample({
        autoplay: true,
        children: (
          <>
            {CandidateCarousel({ className: 'radcn-carousel--plugin', id: 'candidate-carousel-plugin' })}
            <div class="radcn-carousel-plugin-note" data-fixture-carousel-plugin-note>Autoplay pauses on hover.</div>
          </>
        ),
      })
    case 'size':
      return CandidateCarousel({ className: 'radcn-carousel--size' })
    case 'initial-slide':
      return CandidateCarousel({ defaultIndex: 2 })
    case 'vertical':
      return CandidateCarousel({ orientation: 'vertical' })
    case 'multiple-visible':
      return CandidateCarousel({ className: 'radcn-carousel--multiple' })
    case 'spacing':
      return CandidateCarousel({ className: 'radcn-carousel--spacing' })
    case 'keyboard':
      return CandidateCarousel({ defaultIndex: 1 })
    case 'custom-token':
      return CandidateCarousel({ className: 'radcn-fixture-custom-carousel', defaultIndex: 1 })
    default:
      return CandidateCarousel({})
  }
}
