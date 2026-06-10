class ServerConfig {
  name: string;
  version: string;
  mailgunApiKey?: string;
  mailgunDomain?: string;
  contactEmail?: string;
  // Generic SMTP transport (e.g. Resend: smtp.resend.com:465, user "resend",
  // pass = API key). When smtpHost is set it takes precedence over Mailgun.
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  // From address for outgoing mail. Required for SMTP (the address's domain
  // must be verified with the provider); defaults to
  // ai-assistant@<mailgunDomain> on the Mailgun path.
  fromAddress?: string;

  constructor(name = "Candidate MCP Server", version = "1.0.0", options: {
    mailgunApiKey?: string;
    mailgunDomain?: string;
    contactEmail?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    fromAddress?: string;
  } = {}) {
    this.name = name;
    this.version = version;
    this.mailgunApiKey = options.mailgunApiKey;
    this.mailgunDomain = options.mailgunDomain;
    this.contactEmail = options.contactEmail;
    this.smtpHost = options.smtpHost;
    this.smtpPort = options.smtpPort;
    this.smtpUser = options.smtpUser;
    this.smtpPass = options.smtpPass;
    this.fromAddress = options.fromAddress;
  }
}

class CandidateConfig {
  name: string = "Candidate";
  resumeText?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  websiteText?: string;

  constructor(name: string, options: {
    resumeText?: string;
    resumeUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    websiteText?: string;
  } = {}) {
    this.name = name;
    this.resumeText = options?.resumeText;
    this.resumeUrl = options?.resumeUrl;
    this.linkedinUrl = options?.linkedinUrl;
    this.githubUrl = options?.githubUrl;
    this.websiteUrl = options?.websiteUrl;
    this.websiteText = options?.websiteText;
  }
}

export { CandidateConfig, ServerConfig }; 