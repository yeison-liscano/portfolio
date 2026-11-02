const englishVoice = {
  default: true,
  lang: "en-US",
  localService: true,
  name: "English test voice",
  voiceURI: "test-en",
} satisfies SpeechSynthesisVoice;
const voiceSpanish = {
  ...englishVoice,
  lang: "es-CO",
  name: "Spanish test voice",
  voiceURI: "test-es",
};
const frenchVoice = {
  ...englishVoice,
  lang: "fr-FR",
  name: "French test voice",
  voiceURI: "test-fr",
};

function visitArticle(
  path = "algorithms",
  voices: SpeechSynthesisVoice[] = [englishVoice, voiceSpanish, frenchVoice],
) {
  cy.visit(encodeURI(`/blog/${path}/`), {
    onBeforeLoad(win) {
      // The native setter requires an OS-created voice. Allow our test voices
      // while keeping native utterance events, language, and rate properties.
      // eslint-disable-next-line functional/immutable-data
      Object.defineProperty(win.SpeechSynthesisUtterance.prototype, "voice", {
        configurable: true,
        writable: true,
        value: null,
      });
      cy.stub(win.speechSynthesis, "getVoices").as("voices").returns(voices);
      cy.stub(win.speechSynthesis, "speak").as("speak");
      cy.stub(win.speechSynthesis, "cancel").as("cancel");
    },
  });
  cy.get("article-read-aloud").should("be.visible");
}

function lastUtterance() {
  return cy
    .get<sinon.SinonStub>("@speak")
    .then((stub) => stub.lastCall.args[0] as SpeechSynthesisUtterance);
}

function finishPassage() {
  lastUtterance().then((utterance) => {
    cy.window().then((win) => {
      utterance.dispatchEvent(new win.Event("end"));
    });
  });
}

function framePlayer() {
  cy.get("article-read-aloud").then(($player) => {
    cy.window().then((win) => {
      win.scrollTo(
        0,
        win.scrollY + $player[0].getBoundingClientRect().top - 120,
      );
    });
  });
  cy.get("article-read-aloud").should(($player) => {
    expect($player[0].getBoundingClientRect().top).to.be.within(119, 121);
  });
}

describe("Article read aloud", () => {
  it("reads prose and captions once, without controls, code, or hidden content", () => {
    visitArticle();
    cy.get("@speak").should("not.have.been.called");
    cy.get("#post-article").invoke(
      "html",
      `
      <h2>First heading<a aria-hidden="true">#</a></h2>
      <p>Hello <abbr>REST</abbr><span role="tooltip">Hidden definition</span>
        and <code>inline_code</code>.</p>
      <ul><li>First item.<ul><li><p>Nested item.</p></li></ul></li></ul>
      <p><a href="#">After list.</a></p>
      <pre>Do not read this code</pre><button>Copy</button>
      <table><tr><td>Do not read this table</td></tr></table>
      <figure><div class="post-figure-body"><p>Widget labels</p>
        <svg><text>Diagram labels</text></svg></div>
        <figcaption>A useful caption.</figcaption></figure>
      <p hidden>Hidden paragraph</p><p aria-hidden="true">Hidden decoration</p>
      <div data-read-aloud-skip><p>Skipped section</p></div>
      <nav>Navigation</nav><div class="next-post">Related articles</div>
    `,
    );
    cy.get("[data-play]").click();
    cy.wrap([
      "Classic Algorithms Explained",
      "First heading",
      "Hello REST and inline_code.",
      "First item.",
      "Nested item.",
      "After list.",
      "A useful caption.",
    ]).each((text) => {
      lastUtterance().its("text").should("equal", text);
      finishPassage();
    });
    cy.get("@speak").should("have.callCount", 7);
    cy.get("[data-status]").should("have.text", "Finished reading.");
    cy.get("[data-progress]").should("have.value", 7);
    cy.get("[data-stop]").should("be.disabled");
    cy.get("[data-play]").click();
    lastUtterance().its("text").should("equal", "Classic Algorithms Explained");
  });

  it("pauses, resumes the passage, ignores stale events, and stops", () => {
    visitArticle();
    cy.get("[data-play]").click();
    lastUtterance().then((utterance) => {
      const oldEnd = utterance.onend;
      cy.get("[data-play]").click().should("have.text", "Resume");
      cy.get("@cancel").should("have.been.calledOnce");
      cy.get("[data-play]").click().should("have.text", "Pause");
      lastUtterance().its("text").should("equal", utterance.text);
      cy.window().then((win) => {
        oldEnd?.call(
          utterance,
          new win.SpeechSynthesisEvent("end", { utterance }),
        );
      });
      cy.get("@speak").should("have.callCount", 2);
      cy.get("[data-progress]").should("have.value", 0);
    });
    cy.get("[data-stop]").click().should("be.disabled");
    cy.get("[data-play]").should("have.text", "Listen");
    cy.get("@cancel").should("have.callCount", 2);
  });

  it("applies voice and speed changes during playback", () => {
    const alternative = {
      ...englishVoice,
      name: "Alternative voice",
      voiceURI: "test-alt",
      default: false,
    };
    visitArticle("algorithms", [englishVoice, alternative, voiceSpanish]);
    cy.get("[data-voice] option").should("have.length", 3);
    cy.get("[data-play]").click();
    cy.get("[data-speed]").select("1.5");
    lastUtterance().its("rate").should("equal", 1.5);
    cy.get("[data-voice]").select("test-alt");
    lastUtterance().its("voice.voiceURI").should("equal", "test-alt");
    cy.get("@cancel").should("have.callCount", 2);
  });

  it("waits for asynchronously loaded voices and handles an unavailable language", () => {
    visitArticle("algorithms", []);
    cy.get("[data-play]").should("be.enabled").click();
    lastUtterance().its("lang").should("equal", "en");
    cy.get("[data-stop]").click();
    cy.get<sinon.SinonStub>("@voices").then((stub) =>
      stub.returns([voiceSpanish]),
    );
    cy.window().then((win) => {
      win.speechSynthesis.dispatchEvent(new win.Event("voiceschanged"));
    });
    cy.get("[data-play]").should("be.disabled");
    cy.get("[data-status]").should("contain.text", "No voice is available");
    cy.get<sinon.SinonStub>("@voices").then((stub) =>
      stub.returns([englishVoice]),
    );
    cy.window().then((win) => {
      win.speechSynthesis.dispatchEvent(new win.Event("voiceschanged"));
    });
    cy.get("[data-play]").should("be.enabled").click();
    lastUtterance().its("voice.voiceURI").should("equal", "test-en");
  });

  it("uses the article language for controls and narration", () => {
    visitArticle("drafs/modelo-tcp-ip");
    cy.get("[data-play]").should("have.text", "Escuchar").click();
    lastUtterance().its("lang").should("equal", "es-CO");
    cy.get("[data-stop]").click();
    visitArticle("réflexions-2024");
    cy.get("[data-play]").should("have.text", "Écouter").click();
    lastUtterance().its("lang").should("equal", "fr-FR");
  });

  it("bounds long passages and preserves all prose", () => {
    visitArticle();
    const prose = "A long sentence with many words ".repeat(30).trim();
    cy.get("#post-article").invoke("text", prose);
    cy.get("[data-play]").click();
    finishPassage();
    // Completing each utterance synchronously simulates the engine's end event.
    cy.get<sinon.SinonStub>("@speak").then((stub) => {
      cy.window().then((win) => {
        const drain = (remaining: number): void => {
          const count = stub.callCount;
          const utterance = stub.lastCall.args[0] as SpeechSynthesisUtterance;
          expect(utterance.text.length).to.be.at.most(180);
          utterance.dispatchEvent(new win.Event("end"));
          if (stub.callCount > count && remaining > 0) drain(remaining - 1);
        };
        drain(30);
        const spoken = stub
          .getCalls()
          .slice(1)
          .map((call) => (call.args[0] as SpeechSynthesisUtterance).text)
          .join(" ");
        expect(spoken).to.equal(prose);
      });
    });
    cy.get("[data-status]").should("have.text", "Finished reading.");
  });

  it("recovers from speech errors and cancels when leaving the page", () => {
    visitArticle();
    cy.get("[data-play]").click();
    lastUtterance().then((utterance) => {
      cy.window().then((win) => {
        utterance.dispatchEvent(new win.Event("error"));
      });
    });
    cy.get("[data-status]").should("contain.text", "Reading stopped");
    cy.get("[data-play]").should("have.text", "Listen").click();
    cy.window().then((win) => {
      win.dispatchEvent(new win.Event("pagehide"));
    });
    cy.get("[data-play]").should("have.text", "Listen");
    cy.get("@cancel").should("have.callCount", 2);
  });

  it("hides the player when speech synthesis is unsupported", () => {
    cy.visit("/blog/algorithms/", {
      onBeforeLoad(win) {
        Reflect.deleteProperty(win, "speechSynthesis");
        Reflect.deleteProperty(win, "SpeechSynthesisUtterance");
      },
    });
    cy.get("article-read-aloud").should("not.be.visible");
    cy.get("#post-article").should("be.visible");
  });

  it("fits on phones and keeps keyboard controls visible in both themes", () => {
    cy.viewport(375, 600);
    visitArticle();
    cy.document().then((doc) => doc.fonts.ready);
    cy.get("#app-wrapper, #main-content").invoke("css", "transition", "none");
    cy.get("[data-play]").focus().should("have.focus");
    framePlayer();
    cy.get("article-read-aloud").then(($player) => {
      const bounds = $player[0].getBoundingClientRect();
      expect(bounds.left).to.be.at.least(0);
      expect(bounds.right).to.be.at.most(375);
      expect($player[0].scrollWidth).to.be.at.most($player[0].clientWidth);
    });
    cy.get("html").invoke("attr", "data-theme", "light");
    cy.screenshot("read-aloud-mobile-light", { capture: "viewport" });
    cy.get("html").invoke("attr", "data-theme", "dark");
    cy.screenshot("read-aloud-mobile-dark", { capture: "viewport" });
    cy.viewport(1280, 600);
    framePlayer();
    cy.screenshot("read-aloud-desktop-dark", { capture: "viewport" });
    cy.get("html").invoke("attr", "data-theme", "light");
    cy.screenshot("read-aloud-desktop-light", { capture: "viewport" });
  });
});
