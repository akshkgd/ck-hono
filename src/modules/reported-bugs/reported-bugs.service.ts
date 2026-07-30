import { ReportedBugsRepository } from './reported-bugs.repository.js';
import type { CreateBugInput, UpdateBugInput, BugSearchQueryInput } from './reported-bugs.validation.js';

export class ReportedBugsService {
  private repository: ReportedBugsRepository;

  constructor() {
    this.repository = new ReportedBugsRepository();
  }

  public async reportBug(userId: string, input: CreateBugInput) {
    return this.repository.create(userId, input);
  }

  public async getBug(id: string) {
    const bug = await this.repository.findById(id);
    if (!bug) {
      throw new Error('Bug report not found');
    }
    return bug;
  }

  public async searchBugs(input: BugSearchQueryInput) {
    const offset = (input.page - 1) * input.limit;

    const [bugs, total] = await Promise.all([
      this.repository.search(
        input.q,
        input.limit,
        offset,
        input.sortOrder,
        input.status,
        input.severity
      ),
      this.repository.count(
        input.q,
        input.status,
        input.severity
      ),
    ]);

    return {
      bugs,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      },
    };
  }

  public async updateBug(id: string, input: UpdateBugInput) {
    // Ensure bug exists
    await this.getBug(id);
    return this.repository.update(id, input);
  }

  public async deleteBug(id: string) {
    // Ensure bug exists
    await this.getBug(id);
    await this.repository.delete(id);
    return true;
  }
}
