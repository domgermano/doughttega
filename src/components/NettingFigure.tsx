import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import styled from "styled-components";
import biscuitLog from "../assets/biscuit_log.svg";
import Text from "./layout/Text";

// three.js is heavy, so it only loads once the page is up (separate chunk).
const NetCanvas = lazy(() => import("./NetCanvas"));

const NettingSection = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: ${(p) => p.theme.colors.mustard};
  z-index: -1;
`;

const PillContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: ${(p) => p.theme.space[7]} ${(p) => p.theme.space[7]}
    ${(p) => p.theme.space[8]};

  & > div {
    flex: 1 0 0;
    height: 100%;
    border-radius: 1000px;
    background: ${(p) => p.theme.colors.darkMustard};

    &:nth-child(n + 3) {
      display: none;
    }

    @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
      &:nth-child(n + 3) {
        display: block;
      }
      &:nth-child(n + 4) {
        display: none;
      }
    }

    @media (min-width: ${(p) => p.theme.breakpoints.md}) {
      &:nth-child(n + 4) {
        display: block;
      }
    }
  }
`;

const NettingContent = styled.figure`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 0 ${(p) => p.theme.space[8]} ${(p) => p.theme.space[3]};
  gap: ${(p) => p.theme.space[5]};
  color: ${(p) => p.theme.colors.white};
`;

// Positioning context for the static log and the 3D canvas on top of it.
const LogWrap = styled.div`
  position: relative;
  width: 100%;
`;

// The static SVG stays in the layout the whole time, so the figure never
// jumps in size. It is the fallback (no WebGL, reduced motion, still loading,
// or a load error) and fades out once the 3D net is on screen.
const BiscuitLog = styled.img<{ $hidden: boolean }>`
  display: block;
  width: 100%;
  padding-block: ${(p) => p.theme.space[10]} ${(p) => p.theme.space[9]};
  opacity: ${(p) => (p.$hidden ? 0 : 1)};

  @media (min-width: ${(p) => p.theme.breakpoints.sm}) {
    height: 300px;
  }

  @media (min-width: ${(p) => p.theme.breakpoints.md}) {
    height: 400px;
  }

  @media (min-width: ${(p) => p.theme.breakpoints.lg}) {
    height: 500px;
  }
`;

// Covers exactly the content box of the SVG above (same padding), so the 3D
// log lines up with where the static log sits.
const CanvasBox = styled.div`
  position: absolute;
  inset: ${(p) => p.theme.space[10]} 0 ${(p) => p.theme.space[9]};
`;

// If the 3D net fails to load or crashes, quietly stay on the static SVG.
class NetErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function NettingFigure() {
  // Checked once on mount; if either fails we never load three.js at all.
  const [use3d] = useState(() => !prefersReducedMotion() && canUseWebGL());
  const [ready, setReady] = useState(false);

  return (
    <NettingSection>
      <PillContainer aria-hidden="true">
        <div />
        <div />
        <div />
        <div />
        <div />
      </PillContainer>
      <NettingContent>
        <LogWrap>
          <BiscuitLog
            src={biscuitLog}
            alt="Ready-to-bake biscuit log"
            $hidden={ready}
          />
          {use3d && (
            <CanvasBox>
              <NetErrorBoundary>
                <Suspense fallback={null}>
                  <NetCanvas onReady={() => setReady(true)} />
                </Suspense>
              </NetErrorBoundary>
            </CanvasBox>
          )}
        </LogWrap>
        <Text skin="bodyS" as="figcaption">
          Fig. 1.1: Ready-to-bake biscuit log
        </Text>
      </NettingContent>
    </NettingSection>
  );
}

export default NettingFigure;
