import { cn } from "../lib/utils"

const avatarImage =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 fill=%22%230f766e%22/%3E%3Ccircle cx=%2240%22 cy=%2232%22 r=%2214%22 fill=%22%23ccfbf1%22/%3E%3Cpath d=%22M16 72c4-18 44-18 48 0%22 fill=%22%23ccfbf1%22/%3E%3C/svg%3E'

function Avatar({
  children,
  className,
  size = "default",
}: React.HTMLAttributes<HTMLSpanElement> & { size?: "default" | "sm" | "lg" }) {
  return (
    <span className={cn("reference-avatar", `reference-avatar--${size}`, className)} data-size={size}>
      {children}
    </span>
  )
}

function AvatarImage({ alt = "", src = avatarImage }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} className="reference-avatar-image" loading="lazy" src={src} />
}

function AvatarFallback({ children, hidden = false }: React.HTMLAttributes<HTMLSpanElement> & { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden ? "true" : undefined} className="reference-avatar-fallback">
      {children}
    </span>
  )
}

function AvatarBadge() {
  return <span aria-hidden="true" className="reference-avatar-badge" />
}

function AvatarGroup({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-label="Design team" className="reference-avatar-group">
      {children}
    </div>
  )
}

function AvatarGroupCount({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="reference-avatar-group-count">{children}</div>
}

export function renderAvatarFixture(scenario: string) {
  switch (scenario) {
    case "fallback":
      return (
        <Avatar size="lg">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
    case "badge":
      return (
        <Avatar size="lg">
          <AvatarImage alt="Jamie Doe" />
          <AvatarFallback hidden>JD</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      )
    case "group":
      return (
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      )
    case "custom-token":
      return (
        <Avatar className="reference-fixture-custom-avatar" size="lg">
          <AvatarFallback>FX</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      )
    default:
      return (
        <Avatar>
          <AvatarImage alt="Jamie Doe" />
          <AvatarFallback hidden>JD</AvatarFallback>
        </Avatar>
      )
  }
}
