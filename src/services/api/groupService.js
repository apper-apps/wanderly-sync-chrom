import groupsData from '@/services/mockData/groups.json'

class GroupService {
  constructor() {
    this.groups = groupsData
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.groups]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const group = this.groups.find(g => g.Id === id)
    if (!group) {
      throw new Error('Group not found')
    }
    return { ...group }
  }

  async getByPackageId(packageId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.groups.filter(group => group.packageId === packageId)
  }

  async create(groupData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newGroup = {
      ...groupData,
      Id: Math.max(...this.groups.map(g => g.Id)) + 1
    }
    this.groups.push(newGroup)
    return { ...newGroup }
  }

  async update(id, groupData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.groups.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Group not found')
    }
    this.groups[index] = { ...this.groups[index], ...groupData }
    return { ...this.groups[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.groups.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Group not found')
    }
    this.groups.splice(index, 1)
    return true
  }
}

export const groupService = new GroupService()