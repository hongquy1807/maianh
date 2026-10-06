import unittest
from service import validate, inspect_adapter, DEFAULT_ADAPTER
class Contract(unittest.TestCase):
 def test_adapter(self):
  name, revision=inspect_adapter(DEFAULT_ADAPTER)
  self.assertEqual(name,'Qwen/Qwen2.5-1.5B-Instruct')
  self.assertEqual(len(revision),40)
 def test_validation(self):
  self.assertEqual(validate({'message':' hi '})[0],'hi')
  for data in [None,{}, {'message':'x','history':[{'role':'system','content':'x'}]}, {'message':'x','language':'admin'}]:
   with self.assertRaises(ValueError):validate(data)
 def test_turns(self):
  h=[{'role':'user','content':'hello'},{'role':'assistant','content':'hi'}]
  self.assertEqual(validate({'message':'next','history':h})[1],h)
if __name__=='__main__':unittest.main()
