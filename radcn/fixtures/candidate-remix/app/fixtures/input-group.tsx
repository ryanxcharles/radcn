import type { FixtureScenario } from '../../../scenarios/types.ts'
import {
  Button,
  ButtonGroup,
  ButtonGroupText,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Field,
  FieldDescription,
  FieldError,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  Label,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
  Separator,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from 'radcn'

function MenuItems() {
  return (
    <DropdownMenuPortal>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>Search docs</DropdownMenuItem>
          <DropdownMenuItem>Search packages</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  )
}

export function renderInputGroupFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'button':
      return (
        <div style="display:grid;gap:12px;max-width:420px">
          <InputGroup ariaLabel="Repository clone URL">
            <InputGroupInput id="candidate-input-group-copy" name="clone" readOnly value="git@github.com:radcn/radcn.git" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton ariaLabel="Copy URL" size="icon-xs">⧉</InputGroupButton>
              <Popover>
                <PopoverTrigger ariaLabel="Explain clone URL" class="radcn-input-group-button radcn-input-group-button--icon-xs w-7 p-0">?</PopoverTrigger>
                <PopoverPortal>
                  <PopoverContent align="end">
                    <PopoverTitle>Clone URL</PopoverTitle>
                    <PopoverDescription>Copy behavior belongs to the app enhancement.</PopoverDescription>
                  </PopoverContent>
                </PopoverPortal>
              </Popover>
              <InputGroupButton ariaLabel="Favorite repository" name="favorite" size="icon-xs" value="radcn">☆</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <form action="/fixtures/input-group/button" method="get">
            <InputGroup ariaLabel="Search repositories">
              <InputGroupInput id="candidate-input-group-button-search" name="repo" value="radcn" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton name="intent" type="submit" value="search">Search</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>
      )
    case 'button-group':
      return (
        <ButtonGroup ariaLabel="Workspace URL" style="max-width:440px">
          <ButtonGroupText><Label for="candidate-input-group-button-group">https://</Label></ButtonGroupText>
          <InputGroup ariaLabel="Workspace host">
            <InputGroupInput id="candidate-input-group-button-group" name="host" value="radcn" />
            <InputGroupAddon align="inline-end"><InputGroupText>✓</InputGroupText></InputGroupAddon>
          </InputGroup>
          <ButtonGroupText>.dev</ButtonGroupText>
        </ButtonGroup>
      )
    case 'custom':
      return (
        <form action="/fixtures/input-group/custom" method="get" style="display:grid;gap:12px;max-width:420px">
          <Label for="candidate-input-group-custom-textarea">Prompt</Label>
          <InputGroup ariaLabel="Custom textarea">
            <InputGroupTextarea id="candidate-input-group-custom-textarea" name="prompt" rows={3} value="Summarize the component port." />
            <InputGroupAddon align="block-end">
              <InputGroupText>Native textarea; autosize is app-owned.</InputGroupText>
              <InputGroupButton name="intent" type="submit" value="submit">Submit</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      )
    case 'demo':
      return (
        <div style="display:grid;gap:14px;max-width:480px">
          <InputGroup ariaLabel="Search docs">
            <InputGroupAddon><InputGroupText>⌕</InputGroupText></InputGroupAddon>
            <InputGroupInput id="candidate-input-group-demo-search" name="query" value="input group" />
            <InputGroupAddon align="inline-end"><InputGroupText>18 results</InputGroupText></InputGroupAddon>
          </InputGroup>
          <InputGroup ariaLabel="Production URL">
            <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
            <InputGroupInput id="candidate-input-group-demo-url" name="url" type="url" value="radcn.dev" />
            <InputGroupAddon align="inline-end">
              <Tooltip defaultOpen>
                <TooltipTrigger ariaLabel="URL help" class="radcn-input-group-button radcn-input-group-button--icon-xs w-7 p-0">?</TooltipTrigger>
                <TooltipPortal><TooltipContent>Use a routable domain.</TooltipContent></TooltipPortal>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup ariaLabel="Command message">
            <InputGroupTextarea id="candidate-input-group-demo-message" name="message" rows={4} value="Ship InputGroup parity." />
            <InputGroupAddon align="block-end">
              <InputGroupButton ariaLabel="Add attachment" size="icon-xs">+</InputGroupButton>
              <DropdownMenu defaultOpen>
                <DropdownMenuTrigger ariaLabel="Insert command" class="radcn-input-group-button radcn-input-group-button--sm min-h-8">Commands</DropdownMenuTrigger>
                {MenuItems()}
              </DropdownMenu>
              <Separator orientation="vertical" />
              <InputGroupText>63%</InputGroupText>
              <InputGroupButton ariaDisabled disabled size="sm">Send</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup ariaLabel="Verified handle">
            <InputGroupAddon><InputGroupText>@</InputGroupText></InputGroupAddon>
            <InputGroupInput name="handle" value="radcn" />
            <InputGroupAddon align="inline-end"><InputGroupText>✓ verified</InputGroupText></InputGroupAddon>
          </InputGroup>
        </div>
      )
    case 'dropdown':
      return (
        <div style="display:grid;gap:12px;max-width:420px">
          <InputGroup ariaLabel="Scoped search">
            <InputGroupInput id="candidate-input-group-dropdown" name="query" value="button" />
            <InputGroupAddon align="inline-end">
              <DropdownMenu defaultOpen>
                <DropdownMenuTrigger ariaLabel="Search scope" class="radcn-input-group-button radcn-input-group-button--sm min-h-8">Docs</DropdownMenuTrigger>
                {MenuItems()}
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    case 'icon':
      return (
        <div style="display:grid;gap:12px;max-width:420px">
          <InputGroup ariaLabel="Email address">
            <InputGroupAddon><InputGroupText>✉</InputGroupText></InputGroupAddon>
            <InputGroupInput id="candidate-input-group-email" name="email" type="email" value="team@radcn.dev" />
            <InputGroupAddon align="inline-end"><InputGroupText>✓</InputGroupText></InputGroupAddon>
          </InputGroup>
          <InputGroup ariaLabel="Card search">
            <InputGroupAddon><InputGroupText>◇</InputGroupText></InputGroupAddon>
            <InputGroupInput name="card" value="4242" />
            <InputGroupAddon align="inline-end"><InputGroupButton ariaLabel="Favorite card" size="icon-xs">☆</InputGroupButton></InputGroupAddon>
          </InputGroup>
        </div>
      )
    case 'label':
      return (
        <div style="display:grid;gap:12px;max-width:420px">
          <InputGroup ariaLabel="Username group">
            <InputGroupAddon><Label for="candidate-input-group-label-inline">Username</Label></InputGroupAddon>
            <InputGroupInput id="candidate-input-group-label-inline" name="username" value="radcn" />
          </InputGroup>
          <InputGroup ariaLabel="API token group">
            <InputGroupAddon align="block-start">
              <Label for="candidate-input-group-label-block">API token</Label>
              <Tooltip defaultOpen>
                <TooltipTrigger ariaLabel="Token help" class="radcn-input-group-button radcn-input-group-button--icon-xs w-7 p-0">?</TooltipTrigger>
                <TooltipPortal><TooltipContent>Tokens are submitted as native form values.</TooltipContent></TooltipPortal>
              </Tooltip>
            </InputGroupAddon>
            <InputGroupInput id="candidate-input-group-label-block" name="token" value="radcn-token" />
          </InputGroup>
        </div>
      )
    case 'spinner':
      return (
        <div style="display:grid;gap:12px;max-width:420px">
          <InputGroup disabled ariaLabel="Saving workspace">
            <InputGroupAddon><Spinner ariaLabel="Saving" /></InputGroupAddon>
            <InputGroupInput disabled name="workspace" value="radcn" />
            <InputGroupAddon align="inline-end"><InputGroupText>Saving...</InputGroupText></InputGroupAddon>
          </InputGroup>
          <InputGroup disabled ariaLabel="Loading invite">
            <InputGroupInput disabled name="invite" value="team@radcn.dev" />
            <InputGroupAddon align="inline-end"><Spinner ariaLabel="Loading invite" /></InputGroupAddon>
          </InputGroup>
        </div>
      )
    case 'text':
      return (
        <div style="display:grid;gap:12px;max-width:420px">
          <InputGroup ariaLabel="Price">
            <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
            <InputGroupInput id="candidate-input-group-price" name="price" value="48.00" />
            <InputGroupAddon align="inline-end"><InputGroupText>USD</InputGroupText></InputGroupAddon>
          </InputGroup>
          <InputGroup ariaLabel="Website">
            <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
            <InputGroupInput name="site" value="radcn" />
            <InputGroupAddon align="inline-end"><InputGroupText>.dev</InputGroupText></InputGroupAddon>
          </InputGroup>
          <InputGroup ariaLabel="Post body">
            <InputGroupTextarea name="body" rows={3} value="InputGroup text addons stay composable." />
            <InputGroupAddon align="block-end"><InputGroupText>42 / 280</InputGroupText></InputGroupAddon>
          </InputGroup>
        </div>
      )
    case 'addons':
      return (
        <Field>
          <Label for="candidate-input-group-addons">Search</Label>
          <InputGroup ariaLabel="Search query">
            <InputGroupAddon>
              <InputGroupText>Search</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="candidate-input-group-addons" name="query" placeholder="Packages" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>⌘K</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      )
    case 'buttons':
      return (
        <form action="/fixtures/input-group/buttons" method="get" style="display:grid;gap:12px;max-width:360px">
          <Label for="candidate-input-group-buttons">Repository</Label>
          <InputGroup ariaLabel="Repository search">
            <InputGroupInput id="candidate-input-group-buttons" name="repo" value="radcn" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton name="intent" type="submit" value="search">Go</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      )
    case 'textarea':
      return (
        <Field>
          <Label for="candidate-input-group-textarea">Message</Label>
          <InputGroup ariaLabel="Message">
            <InputGroupAddon align="block-start">
              <InputGroupButton ariaLabel="Refresh file" size="icon-xs">↻</InputGroupButton>
              <InputGroupText>app/routes.ts</InputGroupText>
            </InputGroupAddon>
            <InputGroupTextarea id="candidate-input-group-textarea" name="message" rows={4} value="export default route" />
            <InputGroupAddon align="block-end">
              <InputGroupText>Ln 1, Col 20</InputGroupText>
              <InputGroupButton ariaLabel="Copy code" size="icon-xs">⧉</InputGroupButton>
              <InputGroupButton type="submit">Run</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      )
    case 'tooltip':
      return (
        <div style="display:grid;gap:12px;max-width:420px">
          <InputGroup ariaLabel="Password">
            <InputGroupInput id="candidate-input-group-password" name="password" type="password" value="radical-secret" />
            <InputGroupAddon align="inline-end">
              <Tooltip defaultOpen>
                <TooltipTrigger ariaLabel="Password requirements" class="radcn-input-group-button radcn-input-group-button--icon-xs w-7 p-0">?</TooltipTrigger>
                <TooltipPortal><TooltipContent>Use at least twelve characters.</TooltipContent></TooltipPortal>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup ariaLabel="API key email">
            <InputGroupInput id="candidate-input-group-tooltip-email" name="owner" type="email" value="owner@radcn.dev" />
            <InputGroupAddon align="inline-end">
              <Tooltip defaultOpen>
                <TooltipTrigger ariaLabel="Owner help" class="radcn-input-group-button radcn-input-group-button--icon-xs w-7 p-0">i</TooltipTrigger>
                <TooltipPortal><TooltipContent>Owner receives key rotation notices.</TooltipContent></TooltipPortal>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    case 'disabled-invalid':
      return (
        <div style="display:grid;gap:16px">
          <Field>
            <Label disabled for="candidate-input-group-disabled">Disabled</Label>
            <InputGroup disabled ariaLabel="Disabled input group">
              <InputGroupAddon>
                <InputGroupText>@</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput disabled id="candidate-input-group-disabled" name="disabled" value="disabled" />
            </InputGroup>
          </Field>
          <Field invalid>
            <Label for="candidate-input-group-invalid">Invalid</Label>
            <InputGroup invalid ariaLabel="Invalid input group">
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                ariaDescribedBy="candidate-input-group-invalid-error"
                ariaInvalid
                id="candidate-input-group-invalid"
                name="url"
                value="not-a-url"
              />
            </InputGroup>
            <FieldError id="candidate-input-group-invalid-error">Enter a valid URL.</FieldError>
          </Field>
        </div>
      )
    case 'form-submit-reset':
      return (
        <form action="/fixtures/input-group/form-submit-reset" method="get" style="display:grid;gap:12px;max-width:360px">
          <Label for="candidate-input-group-form">Workspace</Label>
          <InputGroup ariaLabel="Workspace slug">
            <InputGroupAddon>
              <InputGroupText>radcn.dev/</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="candidate-input-group-form" name="workspace" value="design" required />
          </InputGroup>
          <div style="display:flex;gap:12px">
            <Button name="intent" type="submit" value="submit">Submit</Button>
            <Button type="reset" variant="outline">Reset</Button>
          </div>
        </form>
      )
    case 'block-addons':
      return (
        <Field>
          <Label for="candidate-input-group-block">Deploy command</Label>
          <InputGroup ariaLabel="Deploy command">
            <InputGroupAddon align="block-start">
              <InputGroupText>Terminal</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="candidate-input-group-block" name="command" value="pnpm deploy" />
            <InputGroupAddon align="block-end">
              <InputGroupText>Runs in production</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      )
    case 'custom-token':
      return (
        <Field>
          <Label for="candidate-input-group-custom">Custom</Label>
          <InputGroup class="radcn-fixture-custom-input-group" ariaLabel="Custom input group">
            <InputGroupAddon>
              <InputGroupText>#</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="candidate-input-group-custom" name="tag" value="release" />
          </InputGroup>
        </Field>
      )
    default:
      return (
        <Field>
          <Label for="candidate-input-group-default">Email</Label>
          <InputGroup ariaLabel="Email address">
            <InputGroupInput id="candidate-input-group-default" name="email" placeholder="name@example.com" />
          </InputGroup>
          <FieldDescription>Input group preserves native input behavior.</FieldDescription>
        </Field>
      )
  }
}
